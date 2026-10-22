document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const ACCOUNTS_KEY = "ateneaAccounts";
  const SESSION_KEY = "ateneaSession";
  const TEMP_SESSION_KEY = "ateneaTemporarySession";
  const PASSWORD_ITERATIONS = 210000;
  const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

  const parseStored = (storage, key, fallback) => {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  const getAccounts = () => {
    const accounts = parseStored(localStorage, ACCOUNTS_KEY, []);
    return Array.isArray(accounts) ? accounts : [];
  };
  const readSession = () =>
    parseStored(localStorage, SESSION_KEY, null) ||
    parseStored(sessionStorage, TEMP_SESSION_KEY, null);
  const normalizedUsername = (value) => value.trim().toLocaleLowerCase("es");
  const isPersistentSession = () => Boolean(localStorage.getItem(SESSION_KEY));

  const message = (text, ok = true) => {
    const box = $("authMessage");
    if (!box) return;
    box.textContent = text;
    box.className = `auth-message show ${ok ? "ok" : "error"}`;
    window.clearTimeout(message.timer);
    message.timer = window.setTimeout(() => box.classList.remove("show"), 4500);
  };

  const bytesToHex = (bytes) =>
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const derivePasswordHash = async (password, salt) => {
    if (!window.crypto?.subtle) {
      throw new Error("SECURE_CONTEXT_REQUIRED");
    }
    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(salt),
        iterations: PASSWORD_ITERATIONS,
        hash: "SHA-256",
      },
      key,
      256,
    );
    return bytesToHex(new Uint8Array(bits));
  };
  const createSalt = () => {
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    return bytesToHex(salt);
  };
  const createId = () => {
    const id = new Uint8Array(16);
    window.crypto.getRandomValues(id);
    return bytesToHex(id);
  };

  const defaultAvatar = () =>
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#3d3f43"/><circle cx="60" cy="44" r="20" fill="#e5e5e5"/><path d="M12 120c3-28 22-47 48-47s45 19 48 47H12Z" fill="#e5e5e5"/></svg>',
    )}`;
  const safeAccount = (account) => ({
    id: account.id,
    email: account.email,
    username: account.username || account.name || "cliente",
    avatar: account.avatar || "",
    createdAt: account.createdAt || "",
  });

  const showAccount = (account) => {
    const username = account.username || account.name || "cliente";
    const avatar = account.avatar || defaultAvatar();
    $("authCard").classList.add("is-hidden");
    $("accountCard").classList.remove("is-hidden");
    $("accountName").textContent = username;
    $("profileName").value = username;
    $("profileEmail").value = account.email;
    $("accountAvatar").src = avatar;
    $("accountAvatar").alt = `Foto de perfil de ${username}`;
    $("profileAvatarPreview").src = avatar;
    $("profileAvatarPreview").alt = `Vista previa de la foto de perfil de ${username}`;
    $("accountType").textContent = "Cuenta personal";
  };

  const saveSession = (account, remember) => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TEMP_SESSION_KEY);
    const session = JSON.stringify(safeAccount(account));
    (remember ? localStorage : sessionStorage).setItem(
      remember ? SESSION_KEY : TEMP_SESSION_KEY,
      session,
    );
  };
  const enter = (account, welcome = true, remember = true) => {
    const user = safeAccount(account);
    saveSession(user, remember);
    showAccount(user);
    if (welcome) message(`¡Hola, ${user.username}! Ya estás en tu cuenta.`);
  };

  const setAuthMode = (mode, updateAddress = true) => {
    const registering = mode === "register";
    $("registerForm").classList.toggle("is-hidden", !registering);
    $("loginForm").classList.toggle("is-hidden", registering);
    $("switchLabel").textContent = registering
      ? "¿Ya tienes una cuenta?"
      : "¿Aún no tienes una cuenta?";
    $("switchAuth").textContent = registering
      ? "Iniciar sesión"
      : "Regístrate aquí";
    $("authHeading").textContent = registering
      ? "Crea tu cuenta"
      : "Bienvenido de vuelta";
    $("authDescription").textContent = registering
      ? "Elige tu nombre de usuario y crea un espacio propio con Atenea."
      : "Ingresa con tu correo y tu contraseña.";
    if (updateAddress) {
      const hash = registering ? "#registro" : "#acceso";
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${hash}`,
      );
    }
  };

  const readAndResizePhoto = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("PHOTO_READ_FAILED"));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("PHOTO_INVALID"));
        image.onload = () => {
          const maxSide = 512;
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          if (!context) return reject(new Error("PHOTO_PROCESS_FAILED"));
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const bindPhotoInput = (input, preview, onReady) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        input.value = "";
        message("Elige una imagen JPG, PNG o WEBP.", false);
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        input.value = "";
        message("La foto debe pesar menos de 2 MB.", false);
        return;
      }
      try {
        const data = await readAndResizePhoto(file);
        preview.src = data;
        preview.classList.remove("is-hidden");
        onReady(data);
      } catch {
        input.value = "";
        message("No se pudo leer la imagen. Prueba con otra foto.", false);
      }
    });
  };

  let registrationAvatar = "";
  let profileAvatar = "";
  const resetRegistrationPhotoPreview = () => {
    registrationAvatar = "";
    $("registerAvatar").value = "";
    $("registerAvatarPreview").removeAttribute("src");
    $("registerAvatarPreview").classList.add("is-hidden");
    $("registerAvatarPlaceholder").classList.remove("is-hidden");
    $("registerAvatarPreviewText").textContent = "Aquí aparecerá tu foto.";
  };
  bindPhotoInput($("registerAvatar"), $("registerAvatarPreview"), (data) => {
    registrationAvatar = data;
    $("registerAvatarPlaceholder").classList.add("is-hidden");

  });
  bindPhotoInput($("profileAvatar"), $("profileAvatarPreview"), (data) => {
    profileAvatar = data;
  });

  const passwordToggleFields = [
    { inputId: "password", toggleId: "togglePassword", label: "contraseña" },
    {
      inputId: "registerPassword",
      toggleId: "toggleRegisterPassword",
      label: "contraseña",
    },
    {
      inputId: "registerConfirm",
      toggleId: "toggleRegisterConfirm",
      label: "confirmación de contraseña",
    },
  ];
  const resetPasswordVisibility = () => {
    passwordToggleFields.forEach(({ inputId, toggleId, label }) => {
      $(inputId).type = "password";
      $(toggleId).classList.remove("is-visible");
      $(toggleId).setAttribute("aria-pressed", "false");
      $(toggleId).setAttribute("aria-label", `Mostrar ${label}`);
    });
  };
  $("loginForm").addEventListener("reset", resetPasswordVisibility);
  $("registerForm").addEventListener("reset", resetPasswordVisibility);

  $("switchAuth").addEventListener("click", () => {
    resetPasswordVisibility();
    const registering = $("registerForm").classList.contains("is-hidden");
    setAuthMode(registering ? "register" : "login");
  });

  passwordToggleFields.forEach(({ inputId, toggleId, label }) => {
    const password = $(inputId);
    const toggle = $(toggleId);
    toggle.addEventListener("click", () => {
      const showPassword = password.type === "password";
      password.type = showPassword ? "text" : "password";
      toggle.classList.toggle("is-visible", showPassword);
      toggle.setAttribute("aria-pressed", String(showPassword));
      toggle.setAttribute(
        "aria-label",
        `${showPassword ? "Ocultar" : "Mostrar"} ${label}`,
      );
    });
  });

  $("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("loginEmail").value.trim().toLocaleLowerCase("es");
    const password = $("password").value;
    const account = getAccounts().find(
      (entry) => (entry.email || "").toLocaleLowerCase("es") === email,
    );
    if (!account || !account.passwordSalt || !account.passwordHash) {
      message("No encontramos esa cuenta. Revisa tus datos o regístrate.", false);
      return;
    }
    try {
      const candidate = await derivePasswordHash(password, account.passwordSalt);
      if (candidate !== account.passwordHash) {
        message("La contraseña no coincide. Inténtalo de nuevo.", false);
        return;
      }
      enter(account, true, $("rememberMe").checked);
      $("loginForm").reset();
    } catch {
      message("Abre la vista previa en un navegador con conexión segura para iniciar sesión.", false);
    }
  });

  $("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = $("registerName").value.trim();
    const email = $("registerEmail").value.trim().toLowerCase();
    const password = $("registerPassword").value;
    const confirmation = $("registerConfirm").value;
    const usernamePattern = /^[\p{L}\p{N}_.-]{3,24}$/u;
    if (!usernamePattern.test(username)) {
      message("El nombre de usuario debe tener de 3 a 24 caracteres: letras, números, punto, guion o guion bajo.", false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message("Escribe un correo electrónico válido.", false);
      return;
    }
    if (password.length < 6) {
      message("La contraseña debe tener al menos 6 caracteres.", false);
      return;
    }
    if (password !== confirmation) {
      message("Las contraseñas no coinciden.", false);
      return;
    }
    const accounts = getAccounts();
    if (accounts.some((entry) => entry.email.toLowerCase() === email)) {
      message("Ese correo ya está registrado. Inicia sesión con tu cuenta.", false);
      return;
    }
    if (accounts.some((entry) => normalizedUsername(entry.username || entry.name || "") === normalizedUsername(username))) {
      message("Ese nombre de usuario ya está ocupado. Elige otro.", false);
      return;
    }
    try {
      const passwordSalt = createSalt();
      const passwordHash = await derivePasswordHash(password, passwordSalt);
      const account = {
        id: createId(),
        username,
        name: username,
        email,
        passwordSalt,
        passwordHash,
        avatar: registrationAvatar,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
      $("registerForm").reset();
      resetRegistrationPhotoPreview();
      enter(account, true, true);
    } catch (error) {
      if (error?.message === "SECURE_CONTEXT_REQUIRED") {
        message("El navegador debe permitir proteger la contraseña. Abre la vista previa segura e inténtalo otra vez.", false);
      } else {
        message("No se pudo guardar la cuenta en este navegador. Inténtalo de nuevo.", false);
      }
    }
  });

  $("cancelLogin").addEventListener("click", () => {
    $("loginForm").reset();
    message("Se limpiaron los campos de acceso.");
  });
  $("cancelRegister").addEventListener("click", () => {
    $("registerForm").reset();
    resetRegistrationPhotoPreview();
    setAuthMode("login");
  });

  $("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const current = readSession();
    const username = $("profileName").value.trim();
    const usernamePattern = /^[\p{L}\p{N}_.-]{3,24}$/u;
    if (!current) {
      message("Inicia sesión para editar tu perfil.", false);
      return;
    }
    if (!usernamePattern.test(username)) {
      message("El nombre de usuario debe tener de 3 a 24 caracteres.", false);
      return;
    }
    const accounts = getAccounts();
    if (accounts.some((entry) => entry.id !== current.id && normalizedUsername(entry.username || entry.name || "") === normalizedUsername(username))) {
      message("Ese nombre de usuario ya está ocupado. Elige otro.", false);
      return;
    }
    const updated = { ...current, username, name: username, avatar: profileAvatar || current.avatar || "" };
    const updatedAccounts = accounts.map((entry) =>
      entry.id === current.id ? { ...entry, username, name: username, avatar: updated.avatar } : entry,
    );
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
      profileAvatar = "";
      $("profileAvatar").value = "";
      enter(updated, false, isPersistentSession());
      message("Tu perfil se actualizó correctamente.");
    } catch {
      message("No se pudieron guardar los cambios de perfil. Inténtalo otra vez.", false);
    }
  });

  $("logout").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TEMP_SESSION_KEY);
    profileAvatar = "";
    $("profileForm").reset();
    $("accountCard").classList.add("is-hidden");
    $("authCard").classList.remove("is-hidden");
    setAuthMode("login");
    message("Has cerrado sesión correctamente.");
  });

  $("deleteAccount").addEventListener("click", () => {
    const current = readSession();
    if (!current) return;
    if (!window.confirm("¿Eliminar definitivamente tu cuenta y sus datos guardados en este navegador? Esta acción no se puede deshacer.")) return;
    const accounts = getAccounts().filter((entry) => entry.id !== current.id);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TEMP_SESSION_KEY);
    $("accountCard").classList.add("is-hidden");
    $("authCard").classList.remove("is-hidden");
    setAuthMode("login");
    message("Tu cuenta se eliminó correctamente de este navegador.");
  });

  const savedSession = readSession();
  if (savedSession) {
    enter(savedSession, false, isPersistentSession());
  } else if (window.location.hash === "#registro") {
    setAuthMode("register", false);
  } else {
    setAuthMode("login", false);
  }
});
