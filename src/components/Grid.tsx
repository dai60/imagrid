import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, useState } from "react";
import { useMontage } from "../Montage";

const GridItem = ({ src, active }: { src: string; active: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: src });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: active ? 10 : 0,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img className="w-full h-full object-cover" src={src} alt="" />
        </div>
    );
}

const Grid = () => {
    const { state, dispatch } = useMontage();

    const [active, setActive] = useState<UniqueIdentifier | undefined>(undefined);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (e: DragStartEvent) => {
        setActive(e.active.id);
    }

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (active.id !== over?.id) {
            const oldIndex = state.images.findIndex(image => image === active.id);
            const newIndex = state.images.findIndex(image => image === over?.id);
            dispatch({ type: "MOVE_IMAGE", from: oldIndex, to: newIndex });
        }
        setActive(undefined);
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={state.images} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 w-2xl">
                    {state.images.map(image => <GridItem key={image} src={image} active={image === active} />)}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export default Grid;
