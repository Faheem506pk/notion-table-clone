Here’s an updated `README.md` that includes **Select**, **Status**, and **MultiSelect** data types in your **Notion Table Clone** project. This ensures all features are properly documented.

---

# Notion Table Clone

This project replicates the functionality and design of the Notion database table using React, TypeScript, and Vite. It is styled for a clean and minimalistic appearance while ensuring robust features and a seamless user experience.

---

## Features
Thanks for letting me know! Here’s the updated section in the README:  

---

## Features

### Dynamic Table Functionalities

- **Add, Edit, Delete Rows and Columns**  
  Flexibly manage rows and columns, with support for various data types.

- **Drag-and-Drop Reordering**  
  Easily reorder rows and columns using a drag-and-drop interface.

- **Editable Column Names**  
  Edit column names via popovers for a seamless experience.

- **Resizable Columns**  
  Adjust column widths dynamically.

### Supported Data Types

1. **Text**: Standard editable text fields.  
2. **Email**: Editable with a button for redirection and storage in local storage.  
3. **Phone Number**: Includes:  
   - Country code selection via API.  
   - Editable phone numbers.  
   - Button for direct dialing or redirection.  
   - Saves to local storage.  
4. **CNIC**: Formatted as `xxxxx-xxxxxxx-x`.  
5. **Tags**: Dynamically add, edit, and delete tags.  
6. **Select**: Dropdown with predefined options for single selection.  
7. **Status**: Visual indicators for different states (e.g., Active, Inactive).  
8. **MultiSelect**: Dropdown allowing multiple options to be selected.

### Theme Support

- Built-in **Dark and Light Mode** toggle for enhanced usability.

### Clean and Intuitive Design

- **Minimalistic UI** inspired by Notion's database table.  
- Clear lines and structured layout.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/notion-table-clone.git
   ```

2. Navigate to the project directory:

   ```bash
   cd notion-table-clone
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

### Running the Project

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## ESLint Configuration

To maintain clean and consistent code, this project uses ESLint with type-aware linting rules. The configuration is as follows:

1. Update `parserOptions` in your ESLint configuration:

   ```js
   export default tseslint.config({
     languageOptions: {
       parserOptions: {
         project: ['./tsconfig.node.json', './tsconfig.app.json'],
         tsconfigRootDir: import.meta.dirname,
       },
     },
   })
   ```

2. Use stricter linting rules for better type safety:

   ```js
   tseslint.configs.recommendedTypeChecked
   ```

3. Install and configure `eslint-plugin-react`:

   ```bash
   npm install eslint-plugin-react --save-dev
   ```

   Update your ESLint config:

   ```js
   import react from 'eslint-plugin-react';

   export default tseslint.config({
     settings: { react: { version: '18.3' } },
     plugins: { react },
     rules: {
       ...react.configs.recommended.rules,
       ...react.configs['jsx-runtime'].rules,
     },
   });
   ```

---

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For static typing.
- **Vite**: For fast builds and development.
- **Chakra UI**: For consistent and responsive design.
- **React Icons**: For flexible iconography.

---

## Future Enhancements

- Add more data type validations.
- Export table data to CSV or JSON format.

---

## Contributing

Feel free to fork the repository and submit pull requests. All contributions are welcome!

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Let me know if there’s anything else you’d like to add or modify!