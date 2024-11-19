# Booking system

**Polska wersja**: Zobacz [README.pl.md](README.pl.md)

## Project Description

ChurchApp is a web application designed for managing reservations and events in a church context. The app enables users to browse and book available resources and manage events using a clear and intuitive user interface.

## Features

- **User Registration and Login**: Allows users to create accounts and log into the application.
- **Reservations**: Users can create and edit reservations as well as view full lists of available resources for booking.
- **Calendar**: Displays events in a calendar view with booking options based on selected dates.
- **Reservation Details**: Displays the details of each reservation in a dedicated dialog.
- **Dynamic Data Handling**: Data is fetched using services and processed accordingly.
- **Notifications**: Provides notifications to users.

---

## Technologies and Libraries

- **Angular** - Framework for building web applications.
- **NgRx** - State management library for Angular applications.
- **RxJS** - Manages asynchronous operations.
- **TypeScript** - Superset of JavaScript providing typing.
- **Angular Material** - Set of components for designing modern, responsive interfaces.
- **SCSS** - CSS preprocessor offering advanced style control.

---

## Project Structure

```plaintext
src/
├── public/
├── src/
│   ├── app/
│   │   ├── auth/                                // Authorization Module
│   │   │   ├── components/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin.component.html
│   │   │   │   │   ├── admin.component.scss
│   │   │   │   │   └── admin.component.ts
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   ├── login.component.scss
│   │   │   │   │   └── login.component.ts
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   ├── register.component.scss
│   │   │   │   │   └── register.component.ts
│   │   │   │   ├── wrapper/
│   │   │   │   │   ├── wrapper.component.html
│   │   │   │   │   ├── wrapper.component.scss
│   │   │   │   │   └── wrapper.component.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── models/
│   │   │   │   └── auth.model.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   ├── auth.actions.ts
│   │   │   │   ├── auth.effects.ts
│   │   │   │   ├── auth.reducer.ts
│   │   │   │   ├── auth.selectors.ts
│   │   │   │   └── auth.state.ts
│   │   ├── reservation/                         // Reservation Module
│   │   │   ├── components/
│   │   │   │   ├── booking/
│   │   │   │   │   ├── booking.component.html
│   │   │   │   │   ├── booking.component.scss
│   │   │   │   │   └── booking.component.ts
│   │   │   │   ├── calendar/
│   │   │   │   │   ├── calendar.component.html
│   │   │   │   │   ├── calendar.component.scss
│   │   │   │   │   └── calendar.component.ts
│   │   │   │   ├── create-reservation/
│   │   │   │   │   ├── create-reservation.component.html
│   │   │   │   │   ├── create-reservation.component.scss
│   │   │   │   │   └── create-reservation.component.ts
│   │   │   │   ├── detail-dialog/
│   │   │   │   │   ├── detail-dialog.component.html
│   │   │   │   │   ├── detail-dialog.component.scss
│   │   │   │   │   └── detail-dialog.component.ts
│   │   │   │   ├── details/
│   │   │   │   │   ├── details.component.html
│   │   │   │   │   ├── details.component.scss
│   │   │   │   │   └── details.component.ts
│   │   │   │   ├── edit-reservation/
│   │   │   │   │   ├── edit-reservation.component.html
│   │   │   │   │   ├── edit-reservation.component.scss
│   │   │   │   │   └── edit-reservation.component.ts
│   │   │   │   ├── full-list/
│   │   │   │   │   ├── full-list.component.html
│   │   │   │   │   ├── full-list.component.scss
│   │   │   │   │   └── full-list.component.ts
│   │   │   │   ├── list/
│   │   │   │   │   ├── list.component.html
│   │   │   │   │   ├── list.component.scss
│   │   │   │   │   └── list.component.ts
│   │   │   ├── models/
│   │   │   │   └── reservations.model.ts
│   │   │   ├── services/
│   │   │   │   ├── booking.service.ts
│   │   │   │   ├── data.service.ts
│   │   │   │   └── reservation.service.ts
│   │   │   ├── store/
│   │   │   │   ├── reservation.state.ts
│   │   │   │   ├── reservations.actions.ts
│   │   │   │   ├── reservations.effects.ts
│   │   │   │   ├── reservations.reducers.ts
│   │   │   │   └── reservations.selectors.ts
│   │   │   ├── reservation.component.html
│   │   │   ├── reservation.component.scss
│   │   │   └── reservation.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   ├── confirmation-dialog.component.html
│   │   │   │   │   ├── confirmation-dialog.component.scss
│   │   │   │   │   └── confirmation-dialog.component.ts
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.component.html
│   │   │   │   │   ├── footer.component.scss
│   │   │   │   │   └── footer.component.ts
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.component.html
│   │   │   │   │   ├── header.component.scss
│   │   │   │   │   └── header.component.ts
│   │   │   │   ├── loading/
│   │   │   │   │   ├── loading.component.html
│   │   │   │   │   ├── loading.component.scss
│   │   │   │   │   └── loading.component.ts
│   │   │   │   ├── not-found/
│   │   │   │   │   ├── not-found.component.html
│   │   │   │   │   ├── not-found.component.scss
│   │   │   │   │   └── not-found.component.ts
│   │   ├── config/
│   │   │   ├── date-formats.ts
│   │   │   ├── snack-bar.config.ts
│   │   │   └── users-config.ts
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── persistence.service.ts
│   │   │   └── utils.service.ts
│   │   ├── store/
│   │   │   ├── appState.interface.ts
│   │   │   ├── index.ts
│   │   │   └── store.config.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
└── _redirects
```

---

## Key Points of the `Booking system` Project Structure

1. **auth/** - Module responsible for user authorization, including components for login, registration, and user management. It also contains a guard (`auth.guard.ts`) that protects access to selected routes.

2. **reservation/** - Module responsible for managing reservations. It includes components for creating, editing, and viewing reservations, as well as calendar views, reservation lists, and reservation details.

3. **shared/** - Contains shared components that can be used throughout the application, such as the footer (`footer`), header (`header`), loading component (`loading`), and a component for handling confirmation dialogs.

4. **services/** - Contains services that implement business logic and backend communication, including `auth.service.ts` for user authorization and `reservation.service.ts` for handling reservations.

5. **store/** - Implements state management using `NgRx` architecture. It includes files such as `actions`, `reducers`, `effects`, `selectors`, and state files for authorization and reservations.

6. **components/** - Located within different modules and defines the views and logic associated with specific UI elements.

7. **models/** - Stores data models that describe the structure of data used in the application, such as `auth.model.ts` for user data or `reservations.model.ts` for reservation data.

8. **config/** - Contains configuration files, such as date format settings, notification bar settings (`snack-bar.config.ts`), and user configurations.

9. **app.component.ts, app.component.html, app.component.scss** - Main application component that serves as the entry point and structure for the application.

10. **main.ts** - The main entry point for the Angular application, responsible for bootstrapping the main application module.

---

## Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/Anatolii-Stoliarenko/churchApp.git
cd churchApp
```

2. Install dependencies

```bash
npm install
```

3. Run the application

```bash
ng serve
```

The application will be available at http://localhost:4200/.

---

## How It Works

1. The user registers and logs into the application.
2. After logging in, options for making reservations and viewing events are available.
3. The user can create, edit, and view reservations, as well as utilize the details and calendar features.

---

## License

The LICENSE file contains information regarding the project's license.

---

## Contact

If you have any questions about the project or its setup, contact via:

1. **Email**: [anatolii.stoliarenko@gmail.com](mailto:anatolii.stoliarenko@gmail.com)
2. **Website**: [https://anatolii-stoliarenko.webflow.io/](https://anatolii-stoliarenko.webflow.io/)
