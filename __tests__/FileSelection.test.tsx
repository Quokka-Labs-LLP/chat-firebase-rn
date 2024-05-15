/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DocumentPicker from 'react-native-document-picker';
import FileSelection from '../screens/Components/FileSelection';

// Mock the onSelect function
const onSelectMock = jest.fn();
jest.mock('react-native-document-picker', () => ({
    types: {
        images: 'image/jpeg', // Define the types property
        video: 'video/mp4',
        audio: 'audio/mpeg',
        pdf: 'application/pdf',
    },
}));

describe('FileSelection component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const { getByText } = render(<FileSelection visible={true} onClose={() => { }} onSelect={() => { }} />);
        const imagesOption = getByText('Images');
        expect(imagesOption).toBeDefined();
    });

    test('calls onSelect with correct parameters when selecting file types', () => {
        const { getByText } = render(<FileSelection visible={true} onClose={() => { }} onSelect={onSelectMock} />);

        // Simulate press event on each file selection option
        fireEvent.press(getByText('Images'));
        fireEvent.press(getByText('Video'));
        fireEvent.press(getByText('Audio'));
        fireEvent.press(getByText('Camera'));
        fireEvent.press(getByText('Contact'));
        fireEvent.press(getByText('Document'));
        fireEvent.press(getByText('Location'));

        // Expect onSelect to be called with the respective DocumentPicker type or 'Camera'/'Contact'/'Location'
        expect(onSelectMock).toHaveBeenCalledWith(DocumentPicker.types.images);
        expect(onSelectMock).toHaveBeenCalledWith(DocumentPicker.types.video);
        expect(onSelectMock).toHaveBeenCalledWith(DocumentPicker.types.audio);
        expect(onSelectMock).toHaveBeenCalledWith('Camera');
        expect(onSelectMock).toHaveBeenCalledWith('Contact');
        expect(onSelectMock).toHaveBeenCalledWith(DocumentPicker.types.pdf);
        expect(onSelectMock).toHaveBeenCalledWith('Location');

        // Ensure onSelect is called the expected number of times
        expect(onSelectMock).toHaveBeenCalledTimes(7);
    });

    it('closes the modal when touched outside', () => {
        const onCloseMock = jest.fn();
        const { getByTestId } = render(<FileSelection visible={true} onClose={onCloseMock} onSelect={() => { }} />);
        const modalContainer = getByTestId('modal-container');
        fireEvent.press(modalContainer);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
