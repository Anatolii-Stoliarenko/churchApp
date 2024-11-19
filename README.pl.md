# Booking system

**English version**: See [README.md](README.md)

## Opis projektu

ChurchApp to aplikacja webowa służąca do zarządzania rezerwacjami i wydarzeniami w kontekście kościelnym. Aplikacja umożliwia użytkownikom przeglądanie i rezerwowanie dostępnych zasobów oraz zarządzanie wydarzeniami, korzystając z przejrzystego i intuicyjnego interfejsu użytkownika.

## Funkcjonalności

- **Rejestracja i logowanie użytkowników**: Możliwość zakładania kont i logowania użytkowników do aplikacji.
- **Rezerwacje**: Użytkownicy mogą tworzyć i edytować rezerwacje oraz przeglądać pełne listy dostępnych zasobów do rezerwacji.
- **Kalendarz**: Wyświetlanie wydarzeń w kalendarzu z możliwością rezerwacji na podstawie wybranych dat.
- **Szczegóły rezerwacji**: Wyświetlanie szczegółów każdej rezerwacji w dedykowanym dialogu.
- **Obsługa dynamicznych danych**: Dane są pobierane za pomocą serwisów i odpowiednio przetwarzane.
- **Notyfikacje**: Możliwość wyświetlania powiadomień użytkownikom.

---

## Technologie i biblioteki

- **Angular** - Framework do budowy aplikacji webowych.
- **RxJS** - Zarządzanie asynchronicznymi operacjami.
- **NgRx** - Biblioteka do zarządzania stanem aplikacji Angular.
- **TypeScript** - Nadzbiór JavaScript zapewniający typowanie.
- **Angular Material** - Zestaw komponentów do projektowania nowoczesnego i responsywnego interfejsu.
- **SCSS** - Preprocesor CSS zapewniający zaawansowaną kontrolę nad stylami.

---

## Struktura projektu

```plaintext
src/
├── public/
├── src/
│   ├── app/
│   │   ├── auth/                                // Moduł autoryzacji
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
│   │   ├── reservation/                         // Moduł rezerwacji
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

## Kluczowe punkty struktury projektu `Booking system`

1. **auth/** - Moduł odpowiedzialny za autoryzację użytkowników, w tym komponenty do logowania, rejestracji i zarządzania użytkownikami. Zawiera również strażnika (`auth.guard.ts`) chroniącego dostęp do wybranych tras.

2. **reservation/** - Moduł odpowiedzialny za zarządzanie rezerwacjami. Zawiera komponenty umożliwiające tworzenie, edytowanie i przeglądanie rezerwacji, a także widoki kalendarza, listy rezerwacji oraz szczegółów rezerwacji.

3. **shared/** - Zawiera współdzielone komponenty, które mogą być używane w wielu miejscach w aplikacji, takie jak stopka (`footer`), nagłówek (`header`), komponent ładowania (`loading`), a także komponent do obsługi dialogów potwierdzających.

4. **services/** - Zawiera serwisy, które realizują logikę biznesową i komunikację z backendem, w tym np. `auth.service.ts` do obsługi autoryzacji użytkowników oraz `reservation.service.ts` do obsługi rezerwacji.

5. **store/** - Implementuje zarządzanie stanem aplikacji przy użyciu architektury opartej na `NgRx`. Zawiera pliki takie jak `actions`, `reducers`, `effects`, `selectors` oraz pliki stanu (`state`) dla autoryzacji oraz rezerwacji.

6. **components/** - Znajduje się w różnych modułach i definiuje widoki oraz logikę związaną z poszczególnymi elementami interfejsu użytkownika.

7. **models/** - Przechowuje modele danych, które opisują strukturę danych używanych w aplikacji, np. `auth.model.ts` dla danych użytkowników czy `reservations.model.ts` dla danych rezerwacji.

8. **config/** - Zawiera pliki konfiguracyjne, takie jak konfiguracje dla formatu dat, ustawienia paska powiadomień (`snack-bar.config.ts`) oraz konfiguracje użytkowników.

9. **app.component.ts, app.component.html, app.component.scss** - Główny komponent aplikacji, który stanowi punkt wejścia i strukturę aplikacji.

10. **main.ts** - Główny punkt wejściowy aplikacji Angular, odpowiedzialny za bootstrapowanie głównego modułu aplikacji.

---

## Instalacja i uruchomienie

1. Klonowanie repozytorium

```bash
git clone https://github.com/Anatolii-Stoliarenko/churchApp.git
cd churchApp
```

2. Instalacja zależności

```bash
npm install
```

3. Uruchomienie aplikacji

```bash
ng serve
```

Aplikacja będzie dostępna pod adresem http://localhost:4200/.

---

## Sposób działania

1. Użytkownik rejestruje się i loguje do aplikacji.
2. Po zalogowaniu dostępne są opcje rezerwacji i przeglądania wydarzeń.
3. Użytkownik może tworzyć, edytować i przeglądać rezerwacje, a także korzystać z funkcji wyświetlania szczegółów i kalendarza.

---

## Dalszy rozwój

1. Walidacje danych: Dodanie walidacji dla pól rezerwacji.
2. Integracja API: Integracja z zewnętrznymi API dla powiadomień.
3. Testy jednostkowe: Dodanie testów jednostkowych dla komponentów i serwisów.

---

## Licencja

Plik LICENSE zawiera informacje dotyczące licencji projektu.

---

## Kontakt

Jeśli masz jakiekolwiek pytania dotyczące projektu lub jego konfiguracji, skontaktuj się poprzez:

1. **Email**: [anatolii.stoliarenko@gmail.com](mailto:anatolii.stoliarenko@gmail.com)
2. **Strona**: [https://anatolii-stoliarenko.webflow.io/](https://anatolii-stoliarenko.webflow.io/)
