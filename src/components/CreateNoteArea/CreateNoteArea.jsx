import { useAppState } from '../../contexts/AppStateContext';
import CreateNote from '../CreateNote/CreateNote';
import CreateNoteForm from '../CreateNoteForm/CreateNoteForm';
import './CreateNoteArea.scss';

const CreateNoteArea = () => {
	// Global States & Actions --------------------------
	const { _isCreateNoteFormOn } = useAppState();

	// Render -----------------------
	return (
		<section className="create-note-area">
			<div
				className="stopPropagation-el"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{_isCreateNoteFormOn ? <CreateNoteForm /> : <CreateNote />}
			</div>
		</section>
	);
};

export default CreateNoteArea;
