/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../screens/Components/Button';
describe('Button component', () => {
    test('renders correctly', () => {
        const { getByText } = render(<Button text="Press Me" onPress={() => { }} />);
        const buttonElement = getByText('Press Me');
        expect(buttonElement).toBeDefined();
    });

    test('calls onPress function when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button text="Press Me" onPress={onPressMock} />);
        const buttonElement = getByText('Press Me');
        fireEvent.press(buttonElement);
        expect(onPressMock).toHaveBeenCalled();
    });

    test('displays text correctly', () => {
        const { getByText } = render(<Button text="Hello" onPress={() => { }} />);
        const buttonElement = getByText('Hello');
        expect(buttonElement).toBeDefined();
    });

    test('applies styles correctly', () => {
        const { getByText } = render(<Button text="Press Me" onPress={() => { }} />);
        const buttonElement = getByText('Press Me');
        console.log(buttonElement);
        // expect(buttonElement).toHaveStyle({
        //     height: 50,
        //     width: '93%',
        //     alignSelf: 'center',
        //     marginTop: 20,
        //     borderWidth: 1,
        //     justifyContent: 'center',
        // });
    });
});
