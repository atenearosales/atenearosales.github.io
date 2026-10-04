document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const demo = { email: 'demo@atenea.com', password: 'Atenea2026', name: 'Cliente Demo', isDemo: true };
  const ACCOUNT_KEY = 'ateneaAccounts';
  const SESSION_KEY = 'ateneaSession';

  const getAccounts = () => {
    try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]'); }
    catch { return []; }
  };
  const getSession = () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  };
  const saveSession = (account) => localStorage.setItem(SESSION_KEY, JSON.stringify(account));
  const message = (text, ok = true) => {
    const box = $('authMessage');
    if (!box) return;
    box.textContent = text;
    box.className = `auth-message show ${ok ? 'ok' : 'error'}`;
    window.clearTimeout(message.timer);
    message.timer = window.setTimeout(() => box.classList.remove('show'), 4000);
  };

  let expected = 7;
  const question = () => {
    const a = Math.floor(Math.random() * 7) + 2;
    const b = Math.floor(Math.random() * 7) + 1;
    expected = a + b;
    $('securityQuestion').textContent = `${a} + ${b}`;
    $('securityAnswer').value = '';
  };
  question();
  $('newQuestion').addEventListener('click', question);
  $('demoAccess').addEventListener('click', () => {
    $('email').value = demo.email;
    $('password').value = demo.password;
    message('Datos de ejemplo cargados. Resuelve la verificación y entra.');
  });

  const initials = (name = 'Cliente') => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const renderAccount = (account) => {
    const safeAccount = { ...account };
    $('authCard').classList.add('is-hidden');
    $('accountCard').classList.remove('is-hidden');
    $('accountName').textContent = safeAccount.name.split(/\s+/)[0];
    $('profileName').value = safeAccount.name;
    $('profileEmail').value = safeAccount.email;
    $('accountAvatar').src = safeAccount.avatar || `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="60" fill="#c9a227"/><text x="60" y="70" text-anchor="middle" font-family="Arial" font-size="38" font-weight="700" fill="#171717">${initials(safeAccount.name)}</text></svg>`)}`;
    $('accountAvatar').alt = `Foto de perfil de ${safeAccount.name}`;
    $('profileAvatarPreview').src = $('accountAvatar').src;
    $('profileAvatarPreview').alt = $('accountAvatar').alt;
    $('accountType').textContent = safeAccount.isDemo ? 'Cuenta de demostración' : 'Cuenta personal';
  };
  const enter = (account, welcome = true) => {
    const normalized = { ...account, isDemo: Boolean(account.isDemo) };
    saveSession(normalized);
    renderAccount(normalized);
    if (welcome) message(`¡Bienvenido a tu cuenta, ${normalized.name}!`);
  };

  $('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('email').value.trim().toLowerCase();
    const password = $('password').value;
    if (Number($('securityAnswer').value) !== expected) return message('Resuelve correctamente la verificación de seguridad.', false);
    const found = [demo, ...getAccounts()].find(account => account.email === email && account.password === password);
    if (!found) return message('Correo o contraseña incorrectos. Puedes usar la cuenta demo.', false);
    enter(found);
  });

  $('switchAuth').addEventListener('click', () => {
    const register = $('registerForm').classList.toggle('is-hidden');
    $('loginForm').classList.toggle('is-hidden');
    $('demoAccess').classList.toggle('is-hidden', register);
    $('switchLabel').textContent = register ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?';
    $('switchAuth').textContent = register ? 'Iniciar sesión' : 'Regístrate aquí';
    $('authHeading').textContent = register ? 'Crea tu cuenta' : 'Bienvenido de vuelta';
    $('authDescription').textContent = register ? 'Regístrate para comenzar tu recorrido con Atenea.' : 'Usa los datos predeterminados o crea tu propia cuenta para comenzar.';
  });

  $('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('registerName').value.trim();
    const email = $('registerEmail').value.trim().toLowerCase();
    const password = $('registerPassword').value;
    if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || password !== $('registerConfirm').value) {
      return message('Revisa tus datos y confirma una contraseña de 6 caracteres.', false);
    }
    if (email === demo.email || getAccounts().some(account => account.email === email)) return message('Ese correo ya está registrado.', false);
    const account = { name, email, password, avatar: '' };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...getAccounts(), account]));
    enter(account);
  });

  $('profileAvatar').addEventListener('change', () => {
    const file = $('profileAvatar').files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { $('profileAvatar').value = ''; return message('Selecciona una imagen válida.', false); }
    if (file.size > 2 * 1024 * 1024) { $('profileAvatar').value = ''; return message('La foto debe pesar menos de 2 MB.', false); }
    const reader = new FileReader();
    reader.onload = () => { $('profileAvatarPreview').src = reader.result; };
    reader.readAsDataURL(file);
  });

  $('profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const current = getSession();
    const name = $('profileName').value.trim();
    if (!current || name.length < 3) return message('El nombre de usuario debe tener al menos 3 caracteres.', false);
    const avatar = $('profileAvatarPreview').src.startsWith('data:image/') ? $('profileAvatarPreview').src : (current.avatar || '');
    const updated = { ...current, name, avatar };
    if (!current.isDemo) {
      const accounts = getAccounts().map(account => account.email === current.email ? { ...account, name, avatar } : account);
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    }
    enter(updated, false);
    message('Tu perfil se actualizó correctamente.');
  });

  $('logout').addEventListener('click', () => {
    localStorage.removeItem(SESSION_KEY);
    $('accountCard').classList.add('is-hidden');
    $('authCard').classList.remove('is-hidden');
    $('loginForm').reset();
    question();
    message('Has cerrado sesión correctamente.');
  });

  $('deleteAccount').addEventListener('click', () => {
    const current = getSession();
    if (!current) return;
    if (current.isDemo) return message('La cuenta de demostración no se puede eliminar. Regístrate para crear una cuenta personal.', false);
    if (!window.confirm('¿Eliminar definitivamente tu cuenta y sus datos de este dispositivo? Esta acción no se puede deshacer.')) return;
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(getAccounts().filter(account => account.email !== current.email)));
    localStorage.removeItem(SESSION_KEY);
    $('accountCard').classList.add('is-hidden');
    $('authCard').classList.remove('is-hidden');
    message('Tu cuenta se eliminó correctamente.');
  });

  const saved = getSession();
  if (saved) enter(saved, false);
});
