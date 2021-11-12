import CloseIcon from '@mui/icons-material/Close';
import { useAppAction, useAppState } from '../../contexts/AppStateContext';
import AddBtn from '../Common/AddBtn';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import './UpdateNote.scss';
import { useCallback, useEffect, useState } from 'react';
import { COMPLETE_TEXT, TITLE_TEXT } from '../../constants/constants';
import { emptyTextBlockFilter } from '../../utils/emptyTextBlockFilter';
import CreateContent from '../CreateContent/CreateContent';
import useAddDefaultBlock from '../../hooks/useAddDefaultBlock';
import ImgInput from '../Common/ImgInput';
import { MODAL_NOTE_CLOSE_ICON_STYLE } from '../../constants/iconStyles';

const UpdateNote = () => {
	// Global States, Actions ---------------------------------------
	const { _blocks, _modalNote } = useAppState();
	const {
		_resetModalNote,
		_updateNote,
		_initBlocks,
		_resetBlocks,
		_addTypeBlock,
	} = useAppAction();

	// Local States ------------------------------------------------
	const [note, setNote] = useState(_modalNote);

	// Event Handler ----------------------------------------------
	const handleUpdateNoteBtnOnClick = useCallback(() => {
		const filteredBlocks = emptyTextBlockFilter(_blocks);
		_updateNote({ ...note, blocks: [...filteredBlocks] });
	}, [_updateNote, note, _blocks]);

	const handleTitleInputOnChange = useCallback((e) => {
		const { value } = e.target;
		setNote((note) => ({ ...note, title: value }));
	}, []);

	const handleAddBlockBtnOnClick = useCallback(
		(type, dataUrl) => {
			_addTypeBlock(type, dataUrl);
		},
		[_addTypeBlock]
	);

	// useEffects ------------------------------------------------------
	useAddDefaultBlock(_addTypeBlock, _blocks.length); // hooks로 재사용 관리

	useEffect(() => {
		_initBlocks([..._modalNote.blocks]);

		return () => {
			_resetBlocks();
		};
	}, [_modalNote, _initBlocks, _resetBlocks]);

	return (
		<>
			<div className="update_note">
				<div className="title">
					<input
						type="text"
						className="title_input"
						value={note.title}
						placeholder={TITLE_TEXT}
						onChange={handleTitleInputOnChange}
					/>
					<button className="close_btn" onClick={_resetModalNote}>
						<CloseIcon sx={MODAL_NOTE_CLOSE_ICON_STYLE} />
					</button>
				</div>
				<CreateContent blocks={_blocks} isUpdateNote={true} />
				<div className="ctrl_bar">
					<div className="add_btns">
						<ImgInput
							callback={(dataUrl) => {
								handleAddBlockBtnOnClick('image', dataUrl);
							}}
							isUpdate={true}
						>
							<AddBtn Icon={InsertPhotoIcon} isImgBtn />
						</ImgInput>
						<AddBtn
							Icon={FormatListBulletedIcon}
							eventHandler={() => {
								handleAddBlockBtnOnClick('checklist');
							}}
						/>
						<AddBtn
							Icon={TextFieldsIcon}
							eventHandler={() => {
								handleAddBlockBtnOnClick('text');
							}}
						/>
					</div>
					<button
						type="button"
						onClick={handleUpdateNoteBtnOnClick}
						className="update_submit_btn"
					>
						{COMPLETE_TEXT}
					</button>
				</div>
			</div>
		</>
	);
};

export default UpdateNote;
