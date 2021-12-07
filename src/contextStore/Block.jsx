import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
	BlockTypes,
	INVALID_BLOCK_TYPE_TEXT,
	NO_MATCHED_ID_IN_BLOCKS_TEXT,
} from '../constants/constants';
import useError from '../hooks/useError';

// Manage Global States & Actions
const Block = () => {
	const _setUseError = useError();
	/*
	 * ------ Init States : useState ------------------
	 * Use for Creating or Updating Blocks of Note
	 * temporarily, Take inputs of blocks to put "_allNotes"
	 * ex. _blocks
	 *[
	 *  {
	 *  	id: '',
	 *  	type: 'text',
	 *  	text: ''
	 *	},
	 *	{
	 *  	id: '',
	 *  	type: 'checklist',
	 *  	isDone: false,
	 *  	content: ''
	 *	},
	 * 	{
	 * 		id: '',
	 * 		type: 'image',
	 * 		dataUrl: ''
	 * 	}
	 *]
	 */
	const [_blocks, setBlocks] = useState([]);
	const [_indexToFocus, setIndexToFocus] = useState(-1);

	/*
	 * About focus
	 */
	const _setIndexToFocus = useCallback(
		(index) => {
			console.log('Run _setIndexToFocus');
			setIndexToFocus(index);
		},
		[setIndexToFocus]
	);

	/*
	 * ------ Actions: useCallback ------------------
	 * ~~~~ About Blocks ~~~~
	 * - _resetBlocks : Set "_blocks" to [] (Empty Array)
	 * - _initBlocks : Set "_blocks" to already existed blocks of Note
	 * - _addTypeBlock : Add A specific Block to "_blocks"
	 * - _deleteBlock : Delete A specific Block from "_blocks"
	 * - _updateBlock : Update A specific Block of "_blocks"
	 */
	const _resetBlocks = useCallback(() => {
		setBlocks([]);
	}, []);

	const _initBlocks = useCallback((blocks) => {
		setBlocks(blocks);
	}, []);

	const _addTypeBlock = useCallback(
		(type, dataUrl = '', indexToAdd) => {
			// _addTypeBlock : Main Logic --------------------------------------------
			if (indexToAdd) {
				setBlockAtIndex(blockObjectRouter(type, dataUrl), indexToAdd);
			} else {
				setLastBlock(blockObjectRouter(type, dataUrl));
			}

			// _addTypeBlock : Local functions ----------------------------------------
			function blockObjectRouter(type, dataUrl) {
				switch (type) {
					case BlockTypes.TEXT:
						return { id: uuid(), type, text: '' };
					case BlockTypes.CHECKLIST:
						return {
							id: uuid(),
							type,
							content: '',
							isDone: false,
						};
					case BlockTypes.IMAGE:
						return { id: uuid(), type, dataUrl };
					default:
						_setUseError({
							message: `${INVALID_BLOCK_TYPE_TEXT}, A wrong input: ${type}`,
							location: '_addTypeBlock',
						});
						return undefined;
				}
			}

			function setLastBlock(blockObject) {
				if (!blockObject) {
					return;
				}
				setBlocks((blocks) => [...blocks, blockObject]);
			}

			function setBlockAtIndex(blockObject, indexToAdd) {
				if (!blockObject) {
					return;
				}
				setBlocks((blocks) => {
					const newBlocks = [...blocks];
					newBlocks.splice(indexToAdd, 0, blockObject);
					return newBlocks;
				});
			}
		},
		[_setUseError]
	);

	const _deleteBlock = useCallback((blockId) => {
		setBlocks((blocks) => blocks.filter((block) => block.id !== blockId));
	}, []);

	const _updateBlock = useCallback(
		(targetBlock) => {
			if (_blocks.find((block) => block.id === targetBlock.id)) {
				setBlocks((blocks) =>
					blocks.map((block) => {
						if (block.id === targetBlock.id) {
							return targetBlock;
						} else {
							return block;
						}
					})
				);
			} else {
				_setUseError({
					message: NO_MATCHED_ID_IN_BLOCKS_TEXT,
					location: 'Block/_updateBlock',
				});
			}
		},
		[_blocks, _setUseError]
	);

	const _moveBlockToBottom = useCallback(
		(targetBlockIndex) => {
			const newBlocks = [..._blocks];
			const [movedItem] = newBlocks.splice(targetBlockIndex, 1);
			newBlocks.push(movedItem);
			setBlocks(newBlocks);
		},
		[_blocks]
	);

	// ------ Combine States & Actions ---------------
	const combineStates = { _blocks, _indexToFocus };
	const combineActions = {
		_deleteBlock,
		_updateBlock,
		_resetBlocks,
		_initBlocks,
		_addTypeBlock,
		_moveBlockToBottom,
		_setIndexToFocus,
	};

	return { ...combineStates, ...combineActions };
};

export default Block;
