import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const GridItem = ({ src, active }: { src: string; active: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: src });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={{ zIndex: active ? 10 : 0, ...style }} {...attributes} {...listeners}>
            <img className="w-full h-full object-cover" src={src} alt="" />
        </div>
    );
}

type GridProps = {
    images: string[];
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const Grid = ({ images, setImages }: GridProps) => {
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
            setImages(prev => {
                const oldIndex = prev.findIndex(image => image === active.id);
                const newIndex = prev.findIndex(image => image === over?.id);
                return arrayMove(prev, oldIndex, newIndex);
            })
        }
        setActive(undefined);
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={images} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 w-2xl">
                    {images.map(image => <GridItem key={image} src={image} active={image === active} />)}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export default Grid;
