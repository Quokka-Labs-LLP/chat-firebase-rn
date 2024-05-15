import {timeFormat} from '../../screens/helper/hepler';
import dayjs from 'dayjs'; // Import dayjs library
import {capitalizeFirstLetter} from '../../screens/helper/hepler';
describe('timeFormat function', () => {
  test('formats valid input date string correctly', () => {
    const dateString = '2024-05-17T10:30:00';
    const formattedTime = timeFormat(dateString);
    const localeTimeFormat = dayjs(dateString).locale('en').format('LT');
    expect(formattedTime).toMatch(localeTimeFormat);
  });

  test('handles invalid input gracefully', () => {
    // Pass an invalid date string (e.g., 'invalid_date_string') which cannot be parsed by dayjs
    const formattedTime = timeFormat('invalid_date_string');
    console.log('formattedTime--', formattedTime);
    expect(formattedTime).toMatch('Invalid Date'); // Replace with your expectation
  });

  test('applies the "en" locale', () => {
    const dateString = '2024-05-17T10:30:00';
    const localeMock = jest.spyOn(dayjs.prototype, 'locale');
    timeFormat(dateString);
    expect(localeMock).toHaveBeenCalledWith('en');
  });
});

// Test cases
describe('capitalizeFirstLetter function', () => {
  test('Capitalize first letter of a word', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  test('Capitalize first letter of an empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  test('Capitalize first letter of a single letter', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  test('Capitalize first letter of a string with only one word', () => {
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  test('Capitalize first letter of a string with multiple words', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
  });

  test('Capitalize first letter of a string with leading whitespace', () => {
    expect(capitalizeFirstLetter('  hello')).toBe('Hello');
  });

  test('Capitalize first letter of a string with trailing whitespace', () => {
    expect(capitalizeFirstLetter('hello  ')).toBe('Hello');
  });

  test('Capitalize first letter of a string with leading and trailing whitespace', () => {
    expect(capitalizeFirstLetter('  hello  ')).toBe('Hello');
  });

  test('Capitalize first letter of a string with special characters', () => {
    expect(capitalizeFirstLetter('$hello')).toBe('$hello');
  });

  test('Capitalize first letter of a string with numbers', () => {
    expect(capitalizeFirstLetter('123hello')).toBe('123hello');
  });

  test('Capitalize first letter of a string with symbols', () => {
    expect(capitalizeFirstLetter('@hello')).toBe('@hello');
  });
});
