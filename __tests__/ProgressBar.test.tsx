/* eslint-disable prettier/prettier */
import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../screens/Components/ProgressBar';
describe('ProgressBar component', () => {
    test('renders correctly', () => {
        render(<ProgressBar progress={0} />);
        // Add your expectations here if needed
    });

    // test('renders progress bar with correct progress', () => {
    //     const progress = 50;
    //     const { getByTestId } = render(<ProgressBar progress={progress} />);
    //     const progressBar = getByTestId('progress-bar');
    //     const progressRect = getByTestId('progress-rect');

    //     // Check if the progress bar component exists
    //     expect(progressBar).toBeDefined();

    //     // Check if the progress rectangle has the correct width based on the progress value
    //     expect(progressRect.props.width).toEqual(progress * 2.3); // Assuming barWidth is 230
    // });

    // Add more tests as needed for different scenarios
});
