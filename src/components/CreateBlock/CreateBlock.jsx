import { INVALID_BLOCK_TYPE_TEXT } from '../../constants/constants';
import useError from '../../hooks/useError';
import CreateChecklistBlock from '../CreateChecklistBlock/CreateChecklistBlock';
import CreateImgBlock from '../CreateImgBlock/CreateImgBlock';
import CreateTextBlock from '../CreateTextBlock/CreateTextBlock';
import './CreateBlock.scss';

const CreateBlock = ({ block, isUpdateNote, children }) => {
	// Hook ----------------------------
	const _setUseError = useError();

	// Functions ----------------------------
	const blockRouter = (BlockType) => {
		switch (BlockType) {
			case 'text':
				return <CreateTextBlock block={block} />;
			case 'checklist':
				return <CreateChecklistBlock block={block} isUpdate={isUpdateNote} />;
			case 'image':
				return <CreateImgBlock block={block} />;
			default:
				_setUseError({
					message: INVALID_BLOCK_TYPE_TEXT,
					location: `${
						isUpdateNote ? 'UpdateNote' : 'CreateNoteForm'
					}/CreateContent/CreateBlock`,
				});
				return <></>;
		}
	};

	// render ----------------------------
	return (
		<div className="create_block">
			{blockRouter(block.type)}
			{children}
		</div>
	);
};

export default CreateBlock;
