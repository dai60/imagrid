import { closestCenter, DndContext, DragEndEvent, DraggableAttributes, DragOverlay, DragStartEvent, KeyboardSensor, MeasuringStrategy, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, Ref, useState } from "react";
import { useMontage } from "../Montage";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

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
        dispatch({ type: "REMOVE_IMAGE", index });
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

const GridItem = ({ src }: { src: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: src,
        animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Item ref={setNodeRef} src={src} style={style} attributes={attributes} listeners={listeners} />
    );
}

const Grid = () => {
    const { elemWidth, elemHeight, state, dispatch } = useMontage();

    const [active, setActive] = useState<string | undefined>(undefined);
    const sensors = useSensors(
        useSensor(PointerSensor),
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

    if (gridWidth > gridHeight) {
        style.width = "100%";
    }
    else {
        style.height = "100%";
    }

    if (state.images.length === 0) {
        return (
            <p className="select-none">Add some images to get started</p>
        );
    }

    return (
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
                    {state.images.map(image => <GridItem key={image.url} src={image.url} />)}
                </div>
            </SortableContext>
            <DragOverlay>
                {active && <Item src={active} />}
            </DragOverlay>
        </DndContext>
    );
}

export default Grid;
