import {
  showNotification,
  initPasswordVisibilityToggle,
} from "../components/utils/pagesUtils";
import areFormElementsValid from "../components/validator/validator";
import { ISignInReqBody } from "./login";

// TODO use submitForm util function to submit form
export interface IRegisterReqBody extends ISignInReqBody {
  firstName: string;
  lastName: string;
}

const handleFormSubmit = async (
  e: Event,
  registerForm: HTMLFormElement
): Promise<void> => {
  e.preventDefault();

  if (!registerForm || registerForm.elements.length < 4) {
    throw new Error("Register form elements are missing or form is invalid");
  }

  const formElements = Array.from(registerForm) as HTMLInputElement[];
  if (!areFormElementsValid(formElements)) return;

  const firstNameField = registerForm.querySelector<HTMLInputElement>(
    "[data-firstNameField]"
  );
  const lastNameField = registerForm.querySelector<HTMLInputElement>(
    "[data-lastNameField]"
  );
  const emailField =
    registerForm.querySelector<HTMLInputElement>("[data-emailField]");
  const passwordField = registerForm.querySelector<HTMLInputElement>(
    "[data-passwordField]"
  );

  if (!firstNameField || !lastNameField || !emailField || !passwordField)
    return;

  const registerRqBody: IRegisterReqBody = {
    firstName: firstNameField.value,
    lastName: lastNameField.value,
    email: emailField.value,
    password: passwordField.value,
  };

  try {
    const response = await fetch("/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRqBody),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      showNotification(responseBody?.message, false);
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
};

//  initialize Register page
const initRegisterPage = (): void => {
  const eyeIconButton = document.querySelector<HTMLButtonElement>(
    "[data-eyeIconButton]"
  );
  const passwordField = document.querySelector<HTMLInputElement>(
    "[data-passwordField]"
  );
  const submitButton: HTMLElement | null = document.querySelector(
    "[data-submitButton]"
  );
  const registerForm = document.querySelector(
    "[data-registerForm]"
  ) as HTMLFormElement;

  if (!passwordField || !eyeIconButton) return;

  initPasswordVisibilityToggle(eyeIconButton,passwordField)
  if (submitButton) {
    submitButton.addEventListener("click", (e) =>
      handleFormSubmit(e, registerForm)
    );
  }
};


export default initRegisterPage;
