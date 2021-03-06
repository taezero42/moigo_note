import React from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import Header from '../Header/Header';
import SelectedHeader from '../SelectedHeader/SelectedHeader';
import './HeaderArea.scss';

const HeaderArea = () => {
	// Global States, Actions ---------------------------------------
	const { _selectedNoteIds } = useAppState();

	// Render -------------------------------------------------------
	return (
		<header>
			{_selectedNoteIds.length === 0 ? <Header /> : <SelectedHeader />}
		</header>
	);
};

export default HeaderArea;
