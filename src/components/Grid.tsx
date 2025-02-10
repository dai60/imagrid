import { closestCenter, DndContext, DragEndEvent, DraggableAttributes, DragOverlay, DragStartEvent, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, Ref, useRef, useState } from "react";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import useMontage from "../hooks/useMontage";
import useObserver from "../hooks/useObserver";

type ItemProps = {
    src: string;
    ref?: Ref<HTMLDivElement>;
    style?: CSSProperties;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

const Item = ({ src, ref, style, attributes, listeners }: ItemProps) => {
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
        ...style,
    };

    return (
        <div className="relative w-full bg-contain bg-center bg-no-repeat" ref={ref} style={itemStyle}>
            <div className="absolute inset-0 w-full h-full" {...attributes} {...listeners}></div>
            <button className="absolute top-2 right-2 cursor-pointer" onClick={handleDelete}>X</button>
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

const Grid = () => {
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

    const gridWidth = elemWidth * state.gridSize.cols;
    const gridHeight = elemHeight * state.gridSize.rows;

    const style: CSSProperties = {
        aspectRatio: `${gridWidth} / ${gridHeight}`,
        gridTemplateColumns: `repeat(${state.gridSize.cols}, 1fr)`,
        gridTemplateRows: `repeat(${state.gridSize.rows}, 1fr)`,
    };

    if (divWidth / gridWidth < divHeight / gridHeight) {
        style.width = "100%";
    }
    else {
        style.height = "100%";
    }

    return (
        <div ref={divRef} className="flex justify-center items-center w-full h-full">
            <DndContext
                sensors={sensors}
                measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                modifiers={[restrictToParentElement]}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={state.images.map(image => image.url)} strategy={rectSortingStrategy}>
                    <div className="grid" style={style}>
                        {state.images.map(image => <GridItem key={image.url} src={image.url} active={image.url === active} />)}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {active && <Item src={active} />}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default Grid;
