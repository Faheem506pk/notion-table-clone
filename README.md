# **Notion Table Clone**  

> 🌟 A sleek and powerful Notion-inspired database table clone, built with **React**, **TypeScript**, and **Vite**.  
> 🌐 [**Live Demo**](https://notiontableclone.vercel.app/) | **Version**: 1.1.1  

---

## 🚀 **Features**  

### ⚡ **Dynamic Table Functionalities**  

- **📝 Add, Edit, Delete Rows and Columns**  
  Flexibly manage rows and columns with support for multiple data types.  

- **📦 Drag-and-Drop Reordering**  
  Effortlessly reorder rows and columns with a smooth drag-and-drop interface.  

- **✏️ Editable Column Names**  
  Modify column names via intuitive popovers.  

- **📏 Resizable Columns**  
  Customize column widths dynamically.  

### 🛠️ **Supported Data Types**  

1. **Text**: Standard editable text fields.  
2. **Email**:  
   - Editable.  
   - Button for redirection.  
   - Auto-save to local storage.  
3. **Phone Number**:  
   - Country code selection via API.  
   - Editable.  
   - Button for dialing or redirection.  
   - Auto-save to local storage.  
4. **CNIC**: Formatted as `xxxxx-xxxxxxx-x`.  
5. **Tags**: Add, edit, and delete tags dynamically.  
6. **Select**: Predefined single-selection dropdown.  
7. **Status**: Visual indicators (e.g., Active, Inactive).  
8. **MultiSelect**: Dropdown supporting multiple selections.  

### 🌙 **Theme Support**  

- Built-in **Dark and Light Mode** toggle for enhanced accessibility and usability.  

### 🎨 **Clean & Intuitive Design**  

- Minimalistic UI inspired by Notion’s database table.  
- Structured layout with clear lines for a polished look.  

---

## 📦 **Dependencies**  

The project relies on the following dependencies and dev dependencies from `package.json`:  

### **Dependencies**  
| Package                        | Version    | Description                                  |  
|--------------------------------|------------|----------------------------------------------|  
| `@chakra-ui/react`             | ^2.10.3    | UI component library.                        |  
| `@chakra-ui/icons`             | ^2.2.4     | Chakra UI icons.                             |  
| `@emotion/react`               | ^11.13.3   | Emotion for styling.                         |  
| `@emotion/styled`              | ^11.13.0   | Styled components.                           |  
| `@fortawesome/react-fontawesome` | ^0.2.2  | Font Awesome integration for React.          |  
| `react-beautiful-dnd`          | ^13.1.1    | Drag-and-drop capabilities.                  |  
| `react-table`                  | ^7.8.0     | Table management library.                    |  
| `react-tag-autocomplete`       | ^7.3.0     | Tag input field with autocomplete.           |  

### **Dev Dependencies**  
| Package                        | Version    | Description                                  |  
|--------------------------------|------------|----------------------------------------------|  
| `@eslint/js`                   | ^9.13.0    | ESLint for linting JavaScript.               |  
| `@vitejs/plugin-react`         | ^4.3.3     | Vite plugin for React.                       |  
| `typescript`                   | ~5.6.2     | Static type checking for JavaScript.         |  
| `eslint`                       | ^9.13.0    | Linting utility.                             |  

For the full list of dependencies, check the `package.json` file in the repository.  

---

## 🛠️ **Getting Started**  

### ✅ **Prerequisites**  

Make sure you have the following installed:  
- [**Node.js**](https://nodejs.org/)  
- [**npm**](https://www.npmjs.com/) or [**yarn**](https://yarnpkg.com/)  

### 📥 **Installation**  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/faheem506pk/notion-table-clone.git  
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

### ▶️ **Running the Project**  

Start the development server:  
```bash  
npm run dev  
```  
or  
```bash  
yarn dev  
```  

🌐 Open your browser and navigate to **`http://localhost:5173`**.  

---

## 💻 **Technologies Used**  

| Technology   | Description                           |  
|--------------|---------------------------------------|  
| **React**    | For building dynamic user interfaces. |  
| **TypeScript** | Adds static typing to JavaScript.   |  
| **Vite**     | Fast development build tool.          |  
| **Chakra UI** | For responsive and consistent design.|  
| **React Icons** | Flexible and customizable icons.   |  

---

## 🎯 **Future Enhancements**  

- ✅ Add more data type validations.  
- ✅ Export table data to CSV or JSON formats.  

---

## 🤝 **Contributing**  

We welcome contributions! 🎉  
1. Fork the repository.  
2. Create a new branch: `git checkout -b feature-name`.  
3. Commit your changes: `git commit -m "Add some feature"`.  
4. Push to the branch: `git push origin feature-name`.  
5. Submit a pull request.  

---

## 📜 **License**  

This project is licensed under the [MIT License](LICENSE).  

---