/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddUserc from '../screens/Components/AddUserc';
// Mock Firestore functions and objects
const mockQuerySnapshot = {
    docs: [
        { data: () => ({ uid: 'user1' }) },
        { data: () => ({ uid: 'user2' }) },
        // Add more mock docs as needed
    ],
};

const mockGroup = {
    data: () => ({ members: ['user1'] }), // Mock data for the group
    get: jest.fn().mockResolvedValue(mockGroup), // Mock the get method
};

const mockFirestore = {
    collection: jest.fn().mockReturnThis(), // Mock the collection method
    doc: jest.fn().mockReturnThis(), // Mock the doc method
    get: jest.fn().mockResolvedValue(mockGroup), // Mock the get method
    where: jest.fn().mockReturnThis(), // Mock the where method
    onSnapshot: jest.fn().mockImplementation((callback) => {
        callback(mockQuerySnapshot); // Simulate a snapshot event
        return jest.fn(); // Return a mock unsubscribe function
    }),
};

// Mock @react-native-firebase/firestore module
jest.mock('@react-native-firebase/firestore', () => ({
    default: jest.fn().mockReturnValue(mockFirestore), // Mock firestore() function
}));

// Test the useEffect hook

describe('AddUserc component', () => {
    test('renders correctly', () => {
        render(<AddUserc visible={true} groupId={'demogrup'} props={{ uid: 'exampleUID', email: 'demo@gmail.com' }} />);
        // Add your expectations here if needed
    });
    test('fetches data from Firestore and updates state', async () => {
        // Render the component with appropriate props
        // Make sure to pass groupId and props.uid
        render(<AddUserc visible={true} groupId="groupId" props={{ uid: 'user1' }} />);

        // Wait for the component to settle (i.e., useEffect to run)
        await waitFor(() => { });

        // Assert that the state is updated correctly
        // You can use getByText, getByTestId, etc., to make assertions
    });
    test('selects member', () => {
        const { getByText } = render(<AddUserc visible={true} />);
        fireEvent.press(getByText('default SomeUser')); // Replace 'Some User' with actual text from your component
        // Add expectations here based on the behavior after selecting a member
    });

    test('adds member to group', () => {
        const onCloseMock = jest.fn();
        const { getByTestId } = render(
            <AddUserc visible={true} onClose={onCloseMock} />,
        );
        fireEvent.press(getByTestId('add-member-button')); // Replace 'add-member-button' with actual test ID from your component
        // Add expectations here based on the behavior after adding a member to the group
        expect(onCloseMock).toHaveBeenCalled();
    });
});
