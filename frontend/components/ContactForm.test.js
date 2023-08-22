import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
  render(<ContactForm />);
});

test('renders the contact form header', () => {
  render(<ContactForm />);
  const header = screen.getByText(/contact form/i);
  expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less than 5 characters into firstname.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, 'abc');
  userEvent.tab(); // Move focus away to trigger validation
  const error = await screen.findByTestId('error');
  expect(error).toHaveTextContent('firstName must have at least 5 characters.');
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  userEvent.click(submitButton);
  const errors = await screen.findAllByTestId('error');
  expect(errors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
  
    userEvent.type(firstNameInput, 'Johnn');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.click(submitButton);
  
    const error = await screen.findByTestId('error');
    expect(error).toHaveTextContent('email is a required field.');
  });
  

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, 'invalid-email');
  userEvent.tab(); // Move focus away to trigger validation
  const error = await screen.findByTestId('error');
  expect(error).toHaveTextContent('email must be a valid email address.');
});

test('renders "lastName is a required field" if last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);
    const error = await screen.findByTestId('error');
    expect(error).toHaveTextContent('lastName is a required field.');
  });
  

test('renders all firstName, lastName, and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  userEvent.type(firstNameInput, 'Johnn');
  userEvent.type(lastNameInput, 'Doe');
  userEvent.type(emailInput, 'john.doe@example.com');
  userEvent.click(submitButton);

  const firstNameDisplay = await screen.findByTestId('firstnameDisplay');
  const lastNameDisplay = await screen.findByTestId('lastnameDisplay');
  const emailDisplay = await screen.findByTestId('emailDisplay');
  const messageDisplay = screen.queryByTestId('messageDisplay'); // Should not exist

  expect(firstNameDisplay).toHaveTextContent('First Name: Johnn');
  expect(lastNameDisplay).toHaveTextContent('Last Name: Doe');
  expect(emailDisplay).toHaveTextContent('Email: john.doe@example.com');
  expect(messageDisplay).toBeNull();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
  
    userEvent.type(firstNameInput, 'Johnn');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(emailInput, 'john.doe@example.com');
    userEvent.type(messageInput, 'This is a test message');
    userEvent.click(submitButton);
  
    const firstNameDisplay = await screen.findByTestId('firstnameDisplay');
    const lastNameDisplay = await screen.findByTestId('lastnameDisplay');
    const emailDisplay = await screen.findByTestId('emailDisplay');
    const messageDisplay = await screen.findByTestId('messageDisplay');
  
    expect(firstNameDisplay).toHaveTextContent('First Name: Johnn');
    expect(lastNameDisplay).toHaveTextContent('Last Name: Doe');
    expect(emailDisplay).toHaveTextContent('Email: john.doe@example.com');
    expect(messageDisplay).toHaveTextContent('Message: This is a test message');
  });
  