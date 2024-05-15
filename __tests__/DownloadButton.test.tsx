/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { checkIfFileExists, downloadFileFromurl } from '../screens/helper/useFileStystem';
import DownloadButton from '../screens/Components/DownloadButton';

jest.mock('../screens/helper/useFileStystem', () => ({
    checkIfFileExists: jest.fn().mockResolvedValue(false), // Mock the checkIfFileExists function to always return false
    downloadFileFromurl: jest.fn().mockResolvedValue(),
}));

describe('DownloadButton component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByTestId } = render(<DownloadButton filePath="../../../demo.jpg" />);
        const downloadButton = getByTestId('download-button');
        expect(downloadButton).toBeDefined();
    });

    it('calls handelDownload function when pressed', () => {
        const { getByTestId } = render(<DownloadButton filePath="../../../demo.jpg" />);
        const downloadButton = getByTestId('download-icon');
        fireEvent.press(downloadButton);
        expect(downloadFileFromurl).toHaveBeenCalledTimes(1);
    });

    test('displays download icon when file does not exist', () => {
        checkIfFileExists.mockResolvedValueOnce(false);
        const { getByTestId } = render(<DownloadButton filePath="../../../demo.jpg" />);
        const downloadIcon = getByTestId('download-icon');
        expect(downloadIcon.props.name).toEqual('arrow-down-sharp');
    });

    // it('displays loading indicator when file is downloading', () => {
    //     const { getByTestId } = render(<DownloadButton filePath="../../../demo.jpg" />);
    //     const loadingIndicator = getByTestId('loading-indicator');
    //     expect(loadingIndicator).toBeDefined();
    // });

    test('displays checkmark icon when file download is complete', async () => {
        checkIfFileExists.mockResolvedValueOnce(true);
        const { getByTestId, findByTestId } = render(<DownloadButton filePath="../../../demo.jpg" />);
        const checkmarkIcon = await findByTestId('checkmark-icon');
        expect(checkmarkIcon.props.name).toEqual('checkmark');
    });
});
