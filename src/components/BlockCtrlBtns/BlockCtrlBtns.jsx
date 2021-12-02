import React, { forwardRef, useCallback } from 'react';
import { CTRL_BLOCK_ICON_STYLE } from '../../constants/iconStyles';
import { useAppAction } from '../../contexts/AppStateContext';
import DeleteBtn from '../DeleteBtn/DeleteBtn';
import MenuIcon from '@mui/icons-material/Menu';
import parentStyles from '../CreateBlock/CreateBlock.scss';

const BlockCtrlBtns = forwardRef(({ blockId }, dragRef) => {
	const { _deleteBlock } = useAppAction();
	const handleDeleteBtnOnClick = useCallback(() => {
		_deleteBlock(blockId);
	}, [_deleteBlock, blockId]);

	return (
		<div className={parentStyles.blockCtrlBtns}>
			<DeleteBtn
				className={parentStyles.button}
				style={CTRL_BLOCK_ICON_STYLE}
				handleDeleteBtnOnClick={handleDeleteBtnOnClick}
			/>
			<button className={parentStyles.button} type="button" ref={dragRef}>
				<MenuIcon sx={CTRL_BLOCK_ICON_STYLE} />
			</button>
		</div>
	);
});

export default BlockCtrlBtns;
