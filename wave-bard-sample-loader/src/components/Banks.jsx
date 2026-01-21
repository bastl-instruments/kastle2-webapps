// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import generateId from '@bastl-react/utils/generateId';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import config from '../config';
import bankColors from '../data/bankColors';
import AddBank from './AddBank';
import Bank from './Bank';
import style from './Banks.module.scss';



function SortableBank(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props.id,
        transition: {
            duration: 600, // milliseconds
            easing: 'cubic-bezier(0.55, 1, 0.5, 1)',
        },
    });

    const itemStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 0 : 10
    };

    const bank = props.bank;

    const sortableParams = {
        ref: setNodeRef,
        style: itemStyle,
        ...attributes
    };

    const handleParams = {
        ...listeners,
        ref: setActivatorNodeRef
    };

    const [interacting, setInteracting] = useState(false);

    return (
        <div
            {...sortableParams}
            className={classNames(style.sortableItem, {
                [style.sortableItemInteracting]: interacting,
            })}
        >
            <Bank
                handleParams={handleParams}
                isPlaceholder={isDragging}
                updateBank={props.updateBank}
                setInteracting={setInteracting}
                removeBank={props.removeBank}
                key={bank.id}
                {...bank}
            />
        </div>
    );
}

SortableBank.propTypes = {
    id: PropTypes.string.isRequired,
    bank: PropTypes.object.isRequired,
    updateBank: PropTypes.func,
    removeBank: PropTypes.func,
    label: PropTypes.string,
};


function Banks({ banks, setBanks }) {

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState(null);

    let activeBank = null;
    if (activeId) {
        activeBank = banks.find((bank) => bank.id === activeId);
    }

    function addBank(samples) {
        setBanks((banks) => {
            let color;
            // try to find unused color
            const unusedColors = bankColors.filter((bankColor) => !banks.some((bank) => bank.color?.real === bankColor.real));
            if (unusedColors.length > 0) {
                color = unusedColors[Math.floor(Math.random() * unusedColors.length)];
            } else {
                color = bankColors[Math.floor(Math.random() * bankColors.length)];
            }
            return [...banks, { id: generateId(), color, label: 'New Bank', samples: samples || [] }];
        });
    }

    function removeBank(id) {
        setBanks((banks) => banks.filter((bank) => bank.id !== id));
    }

    function updateBank(id, update) {
        setBanks((banks) => {
            const index = banks.findIndex((bank) => bank.id === id);
            const bank = banks[index];
            const updatedBank = { ...bank, ...update };
            const newBanks = [...banks];
            newBanks[index] = updatedBank;
            return newBanks;
        });
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);
        if (active?.id !== over?.id) {
            setBanks((items) => {
                const oldIndex = items.findIndex((x) => x.id === active?.id);
                const newIndex = items.findIndex((x) => x.id === over?.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(items, oldIndex, newIndex);
                }
                return items;
            });
        }
    }

    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={banks}
                strategy={rectSortingStrategy}
            >
                <div className={classNames(style.banks, activeId ? 'banks-dragging-active' : '')}>
                    {banks.map((bank) => (
                        <SortableBank
                            bank={{ ...bank }}
                            updateBank={updateBank}
                            removeBank={removeBank}
                            key={bank.id}
                            id={bank.id}
                        />
                    ))}
                    {banks.length < config.maxBanks &&
                        <AddBank
                            onClick={() => addBank([])}
                            onSamplesDrop={addBank}
                        />
                    }
                    <DragOverlay>
                        {activeBank ? (
                            <Bank
                                isDragging
                                key={activeBank.id}
                                updateBank={updateBank}
                                removeBank={removeBank}
                                {...activeBank}
                            />
                        ) : null}
                    </DragOverlay>
                </div>
            </SortableContext>
        </DndContext>
    );
};

Banks.propTypes = {
    banks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        color: PropTypes.object,
        label: PropTypes.string,
        samples: PropTypes.array
    })).isRequired,
    setBanks: PropTypes.func.isRequired
};

export default Banks;