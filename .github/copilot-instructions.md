# Copilot Instructions for motostecniya

## Project Overview
This is a web application for managing motorcycle maintenance appointments. The project is structured as a static HTML/CSS frontend with a MariaDB/MySQL backend (see `db/motostecniya.sql`).

## Architecture & Data Flow
- **Frontend:** HTML files (`index.html`, `servicios.html`, etc.) styled with CSS from `estilos/`. No JavaScript or backend code is present in the repo; integration with the database is expected to be handled externally (e.g., via PHP, Python, or another backend not included here).
- **Database:** The SQL schema (`db/motostecniya.sql`) defines tables for clients, mechanics (`tblmecanicoaux`), motorcycles, owners, and maintenance records. Each table uses integer primary keys and relevant fields (see SQL for details).

## Key Patterns & Conventions
- **Static Site:** All user-facing pages are static HTML. To add dynamic features (like forms that connect to the database), you must introduce backend code (not present here).
- **Styling:** Use the CSS files in `estilos/` for consistent design. Reference images from `imagenes/`.
- **Forms:** When adding forms (e.g., for mechanic registration), use semantic HTML. Example fields for mechanics (from `tblmecanicoaux`): Cedula, Nombre, Apellido, Telefono, Correo, Password.

## Example: Mechanic Registration Form
To add a mechanic registration form:
1. Create a form in HTML with fields: Cedula, Nombre, Apellido, Telefono, Correo, Password.
2. To connect to the database, add backend code (PHP, Python, etc.) to process form submissions and insert into `tblmecanicoaux`.
3. Ensure field names match SQL schema for easy integration.

## Developer Workflows
- **Database:** Use `db/motostecniya.sql` to initialize the database. No build/test scripts are present.
- **Static Assets:** Place new images in `imagenes/` and new CSS in `estilos/`.
- **No Frameworks:** No JS frameworks, build tools, or package managers are used.

## Integration Points
- **Backend Integration:** Not present in repo. If needed, create a backend endpoint to handle form submissions and connect to MariaDB/MySQL using the provided schema.

## References
- `index.html`, `servicios.html`, etc.: Main pages
- `db/motostecniya.sql`: Database schema
- `estilos/`: CSS styles
- `imagenes/`: Images

---
**Tip:** For new features, follow the static HTML/CSS pattern and reference the SQL schema for data structure. Backend code must be added separately for database connectivity.
