import {
  useState,
  ChangeEvent,
  FormEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn } from '@api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { Screen } from '@modules';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [signInValues, setSignInValues] = useState({ email: '', password: '' });
  const [signUpValues, setSignUpValues] = useState({ email: '', password: '' });
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signInValidationErrors, setSignInValidationErrors] =
    useState<ValidationErrors>({});
  const [signUpValidationErrors, setSignUpValidationErrors] =
    useState<ValidationErrors>({});

  const navigate = useNavigate();

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email обязателен';
    }
    if (!emailRegex.test(email)) {
      return 'Введите корректный email';
    }
    return null;
  };

  const validateSignUpPassword = (password: string): string | null => {
    if (!password) {
      return 'Пароль обязателен';
    }
    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return null;
  };

  const validateSignInForm = (): boolean => {
    const emailError = validateEmail(signInValues.email);
    const passwordError = signInValues.password
      ? null
      : 'Пароль обязателен';

    setSignInValidationErrors({
      email: emailError || undefined,
      password: passwordError || undefined,
    });

    return !emailError && !passwordError;
  };

  const validateSignUpForm = (): boolean => {
    const emailError = validateEmail(signUpValues.email);
    const passwordError = validateSignUpPassword(signUpValues.password);

    setSignUpValidationErrors({
      email: emailError || undefined,
      password: passwordError || undefined,
    });

    return !emailError && !passwordError;
  };

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSignInError(null);
    setSignUpError(null);
    setSignInValidationErrors({});
    setSignUpValidationErrors({});
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInError(null);
    setSignInValidationErrors({});

    if (!validateSignInForm()) {
      return;
    }

    setSignInLoading(true);

    try {
      const { error: apiError } = await signIn(
        signInValues.email,
        signInValues.password,
      );

      if (apiError) {
        switch (apiError.message) {
          case 'Invalid login credentials':
          case 'Invalid email or password':
            setSignInError('Неверный email или пароль');
            break;
          case 'Email not confirmed':
          case 'Please confirm your email address':
            setSignInError('Пожалуйста, подтвердите ваш email');
            break;
          case 'Invalid email':
            setSignInError('Некорректный формат email');
            break;
          case 'Email rate limit exceeded':
            setSignInError('Слишком много попыток. Попробуйте позже');
            break;
          default:
            console.error('Sign in error:', apiError);
            setSignInError('Произошла ошибка при входе. Попробуйте позже');
        }
        return;
      }

      navigate('/profile');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setSignInError('Произошла ошибка при входе. Попробуйте позже');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpValidationErrors({});

    if (!validateSignUpForm()) {
      return;
    }

    setSignUpLoading(true);

    try {
      const { error: apiError } = await signUp(
        signUpValues.email,
        signUpValues.password,
      );

      if (apiError) {
        switch (apiError.message) {
          case 'User already registered':
          case 'A user with this email address has already been registered':
            setSignUpError('Пользователь с таким email уже существует');
            break;
          case 'Password should be at least 6 characters':
            setSignUpError('Пароль должен содержать минимум 6 символов');
            break;
          case 'Invalid email':
            setSignUpError('Некорректный формат email');
            break;
          case 'Email rate limit exceeded':
            setSignUpError('Слишком много попыток. Попробуйте позже');
            break;
          default:
            console.error('Registration error:', apiError);
            setSignUpError('Произошла ошибка при регистрации. Попробуйте позже');
        }
        return;
      }

      alert('Проверьте вашу почту для подтверждения регистрации!');
      setSignUpValues({ email: '', password: '' });
      setTabValue(0);
    } catch (error) {
      console.error('Unexpected registration error:', error);
      setSignUpError('Произошла ошибка при регистрации. Попробуйте позже');
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <Screen>
      <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  py: 2,
                },
              }}
            >
              <Tab label="Вход" />
              <Tab label="Регистрация" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mb: 4,
              }}
            >
              Вход в систему
            </Typography>
            <Box component="form" onSubmit={handleSignIn} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={signInValues.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const sanitizedEmail = value.replace(/\s+/g, '');
                  setSignInValues(prev => ({ ...prev, email: sanitizedEmail }));
                  setSignInValidationErrors(prev => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
                error={!!signInValidationErrors.email}
                helperText={signInValidationErrors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={signInValues.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setSignInValues(prev => ({ ...prev, password: value }));
                  setSignInValidationErrors(prev => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
                error={!!signInValidationErrors.password}
                helperText={signInValidationErrors.password}
                sx={{ mb: 2 }}
              />
              {signInError && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {signInError}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                }}
                disabled={signInLoading}
              >
                {signInLoading ? 'Загрузка...' : 'Войти'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mb: 4,
              }}
            >
              Регистрация
            </Typography>
            <Box component="form" onSubmit={handleSignUp} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={signUpValues.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const sanitizedEmail = value.replace(/\s+/g, '');
                  setSignUpValues(prev => ({ ...prev, email: sanitizedEmail }));
                  setSignUpValidationErrors(prev => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
                error={!!signUpValidationErrors.email}
                helperText={signUpValidationErrors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="new-password"
                value={signUpValues.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setSignUpValues(prev => ({ ...prev, password: value }));
                  setSignUpValidationErrors(prev => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
                error={!!signUpValidationErrors.password}
                helperText={signUpValidationErrors.password}
                sx={{ mb: 2 }}
              />
              {signUpError && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {signUpError}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                }}
                disabled={signUpLoading}
              >
                {signUpLoading ? 'Загрузка...' : 'Зарегистрироваться'}
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Screen>
  );
};
