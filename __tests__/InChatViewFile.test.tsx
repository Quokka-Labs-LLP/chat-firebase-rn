/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InChatViewFile from '../screens/Components/InChatViewFile';
describe('InChatViewFile component', () => {
    test('renders correctly', () => {
        render(<InChatViewFile props={{ file: { url: 'sampleUrl' }, image: [], vedio: [] }} visible={true} onClose={() => { }} />);
        // Add your expectations here if needed
    });

    test('calls onClose when close button is pressed', () => {
        const onCloseMock = jest.fn();
        const { getByTestId } = render(<InChatViewFile props={{ file: { url: 'sampleUrl' }, image: [], vedio: [] }} visible={true} onClose={onCloseMock} />);
        const closeButton = getByTestId('close-button');
        fireEvent.press(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('renders Pdf component when props.file.url is provided', () => {
        const { getByTestId } = render(<InChatViewFile props={{ file: { url: 'sampleUrl' }, image: [], vedio: [] }} visible={true} onClose={() => { }} />);
        const pdfComponent = getByTestId('pdf-component');
        expect(pdfComponent).toBeDefined();
    });

});
