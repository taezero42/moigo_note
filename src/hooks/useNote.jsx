import { useCallback, useState } from 'react';

// Manage Global States & Actions
const useNote = () => {
	// ------ Init State : useState ------------------
	const [isOnCreateNote, setIsOnCreateNote] = useState(false);
	const [selectedNoteIds, setSelectedNoteIds] = useState([]); // ex. [ id, id, id, ...]
	const [allNotes, setAllNotes] = useState([]); // ex. [{title, id, blocks}, {title, id, blocks}, {title, id, blocks}, ... ]
	const [detailNote, setDetailNote] = useState({}); // ex. {title, id, blocks}
	const [confirmNoteIdtoDelete, setConfirmNoteIdtoDelete] = useState(''); // string : Put a specific Note id to delete

	// ------ Actions: useCallback -------------------
	// ~~~~ Change "isOn(focus)" State of CreateNote Area ~~~~
	const changeIsOnCreateNote = useCallback((value) => {
		setIsOnCreateNote(value);
	}, []);

	// ~~~~ About Selection ~~~~
	const selectNoteId = useCallback((id) => {
		setSelectedNoteIds((ids) => [...ids, id]);
	}, []);

	const deleteNoteId = useCallback(
		(id) => {
			const newSelectedNoteIds = selectedNoteIds.filter(
				(noteId) => noteId !== id
			);
			setSelectedNoteIds(newSelectedNoteIds);
		},
		[selectedNoteIds]
	);

	const cancelSelect = useCallback(() => {
		setSelectedNoteIds([]);
	}, []);

	// ~~~~ Detail Note (ON/OFF) ~~~~
	const onDetailNote = useCallback((note) => {
		setDetailNote(note);
	}, []);

	const offDetailNote = useCallback(() => {
		setDetailNote({});
	}, []);

	const updateDetailNoteChecklist = useCallback(
		(targetBlock) =>
			setDetailNote((detailNote) => {
				const newBlocks = detailNote.blocks.map((block) => {
					if (block.id === targetBlock.id) {
						return { ...targetBlock };
					} else {
						return { ...block };
					}
				});

				return { ...detailNote, blocks: newBlocks };
			}),
		[]
	);

	// ~~~~ Create A Note ~~~~
	const addNote = useCallback(
		(note) => {
			allNotes.unshift(note);
			setAllNotes([...allNotes]);
		},
		[allNotes]
	);

	// ~~~~ Delete A specific Note~~~~
	const deleteNote = useCallback(
		(id) => {
			const newAllNotes = allNotes.filter((note) => note.id !== id);
			setAllNotes(newAllNotes);

			const isSelected = selectedNoteIds.includes(id);
			if (isSelected) {
				deleteNoteId(id);
			}
		},
		[allNotes, selectedNoteIds, deleteNoteId]
	);

	// ~~~~ Delete specific Notes (Selected) ~~~~
	const deleteNotes = useCallback(() => {
		let tempAllNotes = allNotes;
		selectedNoteIds.forEach((id) => {
			tempAllNotes = tempAllNotes.filter((note) => note.id !== id);
		});
		setSelectedNoteIds([]); // Cancel Selected Notes
		setAllNotes(tempAllNotes);
	}, [allNotes, selectedNoteIds]);

	// ~~~~ Update A Note ~~~~
	const updateNote = useCallback(
		(newNote) => {
			const newAllNotes = allNotes.filter((note) => note.id !== newNote.id);
			newAllNotes.unshift(newNote);
			setAllNotes(newAllNotes);
			setDetailNote({});
		},
		[allNotes]
	);

	// ~~~~~ Update specific Checklistblock of A Note
	const updateNoteChecklist = useCallback((noteId, targetBlock) => {
		setAllNotes((AllNotes) => {
			return AllNotes.map((note) => {
				if (note.id === noteId) {
					const newBlocks = note.blocks.map((block) => {
						if (block.id === targetBlock.id) {
							return { ...targetBlock };
						}
						return { ...block };
					});
					return { ...note, blocks: newBlocks };
				}
				return { ...note };
			});
		});
	}, []);

	// ------ Combine States & Actions ------
	const combineStates = {
		allNotes,
		isOnCreateNote,
		selectedNoteIds,
		detailNote,
		confirmNoteIdtoDelete,
	};
	const combineActions = {
		addNote,
		changeIsOnCreateNote,
		deleteNote,
		deleteNotes,
		selectNoteId,
		deleteNoteId,
		cancelSelect,
		onDetailNote,
		offDetailNote,
		updateNote,
		setConfirmNoteIdtoDelete,
		updateNoteChecklist,
		updateDetailNoteChecklist,
	};

	return { ...combineStates, ...combineActions };
};

export default useNote;
