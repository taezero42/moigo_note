import { useCallback, useEffect, useRef } from 'react';
import styles from './CreateTextBlock.scss';
import { useAppAction, useAppState } from '../../contexts/AppStateContext';
import PropTypes from 'prop-types';
import { BlockTypes, WRITE_NOTE_TEXT } from '../../constants/constants';
import useAutoHeightTextarea from '../../hooks/useAutoHeightTextarea';
import {
	handleBlockWithArrowKey,
	handleBlockWithBackspaceKey,
	handleBlockWithBrackets,
	handleBlockWithEnterKey,
} from '../../utils/handleBlockOnkeyDown';
import useIsPrevBlockToFocus from '../../hooks/useIsPrevBlockToFocus';
import setCaretEnd from '../../utils/setCaretEnd';

const CreateTextBlock = ({ block, blockIndex }) => {
	// Global States, Actions ---------------------------------------
	const { _updateBlock, _deleteBlock, _setIndexToFocus, _addTypeBlock } =
		useAppAction();
	const { _indexToFocus } = useAppState();

	// Event Handler ----------------------------------------------
	const handleTextOnChange = useCallback(
		(e) => {
			const {
				target: { value },
			} = e;
			_updateBlock({ ...block, text: value });
		},
		[_updateBlock, block]
	);

	const handleOnKeyDown = (e) => {
		// Solved #6 issue
		if (e.nativeEvent.isComposing) {
			return;
		}
		handleBlockWithBrackets(e, () => {
			_updateBlock({
				id: block.id,
				type: BlockTypes.CHECKLIST,
				isDone: false,
				content: '',
			});
		});

		handleBlockWithBackspaceKey(e, block.text, () => {
			_setIndexToFocus(blockIndex - 1);
			_deleteBlock(block.id);
		});

		handleBlockWithEnterKey(e, () => {
			_addTypeBlock(block.type, undefined, blockIndex + 1);
		});

		handleBlockWithArrowKey(
			e,
			() => {
				console.log('Arrow Key Function:', blockIndex - 1);
				console.log(e);
				_setIndexToFocus(blockIndex - 1);
			},
			() => {
				_setIndexToFocus(blockIndex + 1);
			}
		);
	};

	// Ref --------------------------------------------------------
	const textRef = useRef(null);

	// hook : textarea auto height -----------------------------
	useAutoHeightTextarea(textRef, block.text);
	useIsPrevBlockToFocus(blockIndex, _indexToFocus, textRef.current);

	useEffect(() => {
		setCaretEnd(textRef.current); // hook으로 만들어 버리면, DOM이 생겨나는 것을 감지하지 못함
	}, []);

	// Render -------------------------------------------------------
	return (
		<textarea
			className={styles.textBlockTextarea}
			type="text"
			value={block.text}
			onKeyDown={handleOnKeyDown}
			onChange={handleTextOnChange}
			placeholder={WRITE_NOTE_TEXT}
			rows={1}
			ref={textRef}
			spellCheck={false}
			// autoFocus={true}
		/>
	);
};

// PropTypes ----------------------------------------------------------
CreateTextBlock.propTypes = {
	block: PropTypes.object,
};

export default CreateTextBlock;
