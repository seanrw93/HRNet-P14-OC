# HRnet React Conversion

This project is a React-based conversion of the original [HRnet jQuery library](https://github.com/OpenClassrooms-Student-Center/P12_Front-end). It leverages [Vite](https://vitejs.dev/) for fast development and build tooling.

See live version [here](https://hrnet-srw.vercel.app/)

## Features

### jQuery to React Conversion Highlights
- **Modern React Architecture**: Complete migration from jQuery DOM manipulation to React's declarative component-based approach
- **State Management**: Replaced jQuery event handling with Redux Toolkit for predictable state management
- **Component-Based UI**: Modular React components replace jQuery plugins and DOM manipulation
- **Performance Optimization**: React's virtual DOM and efficient re-rendering vs. direct DOM manipulation
- **Modern Build Tools**: Vite replaces traditional jQuery build processes for faster development

### Technical Features
- Modern React (with hooks and functional components)
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)
- Custom DatePicker plugin ([npm package](https://www.npmjs.com/package/react-i18n-datepicker))
- Fast development with Vite and HMR (Hot Module Replacement)
- ESLint for code quality
- Vitest for unit testing
- Modular and maintainable codebase
- No backend is currently implemented; all data is stored in localStorage
- Backend integration is planned for a future update

## Browser Support

This application supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Getting Started

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Run the development server:**
    ```bash
    npm run dev
    ```

3. **Build for production:**
    ```bash
    npm run build
    ```

## Project Structure

```
src/
├── assets/             # Static assets and favicons
│   └── favicons/       # App icons and manifest
├── components/         # Atomic Design component structure
│   ├── atoms/          # Basic building blocks
│   │   ├── Loader/     # Loading spinner component
│   │   └── SelectInput/ # Dropdown select component
│   ├── molecules/      # Component combinations
│   │   ├── EmployeeDataTableRow/ # Table row component
│   │   ├── SortButtons/ # Sorting controls
│   │   └── SuccessModal/ # Success notification modal
│   ├── organisms/      # Complex component groups
│   │   └── EmployeeTable/ # Complete data table
│   └── templates/      # Page layout templates
│       └── Layout/     # Main application layout
├── data/               # Static data and constants
│   ├── departments.js  # Department options
│   └── states.js       # US states data
├── pages/              # Page-level components
│   ├── AddEmployeesPage/ # Employee creation form
│   ├── EmployeesListPage/ # Employee listing page
│   └── NotFound/       # 404 error page
├── store/              # Redux store configuration
│   ├── employeeSlice.js # Employee state management
│   └── store.js        # Store setup and configuration
├── styles/             # CSS styling files
│   └── app.css         # Global application styles
├── utils/              # Utility functions and helpers
│   ├── convertToISO.js # Date conversion utilities
│   └── reformatCamelCase.js # String formatting helpers
├── App.jsx             # Main application component
└── main.jsx            # Application entry point

README.md              # Project documentation
package.json           # Dependencies and scripts
vite.config.js         # Vite configuration
```

## Testing

This project uses Vitest for unit testing. Available commands:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Linting

This project uses ESLint for code linting. Run the following to check for lint errors:

```bash
npm run lint
```

## Deployment

After building the application, deploy the `dist/` folder to your hosting provider:

1. **Build the application:**
    ```bash
    npm run build
    ```

2. **Deploy options:**
    - **Static hosting** (Netlify, Vercel, GitHub Pages): Upload the `dist/` folder
    - **Web server** (Apache, Nginx): Serve the `dist/` folder as static files
    - **CDN**: Upload contents to your CDN of choice

3. **Important**: Ensure your server is configured for single-page applications (SPA) to handle client-side routing.

## Contributing

Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the MIT License.
