import { closestCenter, DndContext, DragEndEvent, DraggableAttributes, DragOverlay, DragStartEvent, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CSSProperties, Ref, useRef, useState } from "react";
import useMontage from "../hooks/useMontage";
import useObserver from "../hooks/useObserver";
import { MdClose as Close, MdFileUpload as FileUpload } from "react-icons/md";
import { useTranslation } from "react-i18next";

type ItemProps = {
    src: string;
    ref?: Ref<HTMLDivElement>;
    style?: CSSProperties;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

const Item = ({ src, ref, style, attributes, listeners }: ItemProps) => {
    const { t } = useTranslation();
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const handleDelete = () => {
        const index = state.images.findIndex(image => image.url === src);
        if (index !== -1) {
            dispatch({ type: "REMOVE_IMAGE", index });
            URL.revokeObjectURL(src);
        }
    }

    const itemStyle: CSSProperties = {
        aspectRatio: `${elemWidth} / ${elemHeight}`,
        backgroundImage: `url(${src})`,
        backgroundSize: state.imageFit,
        ...style,
    };

    return (
        <div className="relative w-full bg-center bg-no-repeat" ref={ref} style={itemStyle}>
            <div className="absolute inset-0 w-full h-full" {...attributes} {...listeners}></div>
            <button className="absolute top-2 right-2 cursor-pointer max-w-6 max-h-6 min-w-4 min-h-4 size-[25%]" aria-label={t("removeImage")} onClick={handleDelete}>
                <Close className="mix-blend-difference text-white size-full hover:invert-50 transition-all" />
            </button>
        </div>
    );
}

type GridItemProps = {
    src: string;
    active?: boolean;
}

const GridItem = ({ src, active }: GridItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: src,
        // animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: active ? "20%" : "100%",
    };

    return (
        <Item ref={setNodeRef} src={src} style={style} attributes={attributes} listeners={listeners} />
    );
}

type GridProps = {
    onEmptyClick: () => void;
}

const Grid = ({ onEmptyClick }: GridProps) => {
    const { t } = useTranslation();
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const divRef = useRef<HTMLDivElement>(null);
    const [divWidth, divHeight] = useObserver(divRef);

    const [active, setActive] = useState<string | undefined>(undefined);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (e: DragStartEvent) => {
        if (typeof e.active.id !== "string") {
            throw new Error("only string ids allowed");
        }
        setActive(e.active.id);
    }

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (active.id !== over?.id) {
            const oldIndex = state.images.findIndex(image => image.url === active.id);
            const newIndex = state.images.findIndex(image => image.url === over?.id);
            dispatch({ type: "MOVE_IMAGE", from: oldIndex, to: newIndex });
        }
        setActive(undefined);
    }

    const gridWidth = elemWidth * state.gridCols;
    const gridHeight = elemHeight * state.gridRows;

    const style: CSSProperties = {
        aspectRatio: `${gridWidth} / ${gridHeight}`,
        gridTemplateColumns: `repeat(${state.gridCols}, 1fr)`,
        gridTemplateRows: `repeat(${state.gridRows}, 1fr)`,
    };

    if (divWidth / gridWidth < divHeight / gridHeight) {
        style.width = "100%";
    }
    else {
        style.height = "100%";
    }

    return (
        <div ref={divRef} className="flex justify-center items-center size-full">
            {state.images.length === 0 ? (
                <button onClick={onEmptyClick} className="cursor-pointer p-4 text-main-accent hover:brightness-125 transition-all">
                    <FileUpload className="mx-auto mb-1 size-12 sm:size-16" />
                    <p className="select-none text-xs sm:text-sm text-center">{t("addImages")}</p>
                </button>
            ) : (
                <DndContext
                    sensors={sensors}
                    measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                    modifiers={[restrictToParentElement]}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={state.images.map(image => image.url)} strategy={rectSortingStrategy}>
                        <div className="grid border-2 border-border border-dashed" style={style}>
                            {state.images.map(image => <GridItem key={image.url} src={image.url} active={image.url === active} />)}
                        </div>
                    </SortableContext>
                    <DragOverlay>
                        {active && <Item src={active} />}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
}

export default Grid;
