/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../login';

describe('Login Component', () => {

  // Comprobamos que se despliegue el icono de candado por defecto

  test('renders lock icon by default', () => {
    render(<Login />);
    // Buscamos el botón por su etiqueta de accesibilidad
    const lockIcon = screen.getByLabelText('Show password');
    // Verificamos que el botón que contiene el icono está en el documento
    expect(lockIcon).toBeInTheDocument();
  });


});