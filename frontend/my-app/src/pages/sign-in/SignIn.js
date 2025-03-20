import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import Alert from '@mui/material/Alert';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stepper, Step, StepLabel, CircularProgress, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LockReset as LockResetIcon } from '@mui/icons-material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const router = useRouter();
  const theme = useTheme();
  
  const [formData, setFormData] = React.useState({
    emailOrPhone: '',
    password: '',
  });
  
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  
  // Thêm state cho forgot password dialog
  const [openForgotPassword, setOpenForgotPassword] = React.useState(false);
  const [forgotPasswordData, setForgotPasswordData] = React.useState({
    emailInput: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordError, setForgotPasswordError] = React.useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = React.useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const forgotPasswordFormRef = React.useRef(null);
  
  const steps = ['Nhập email', 'Nhập mã xác nhận', 'Đặt lại mật khẩu'];
  const API_URL = 'http://localhost:8080/api/auth';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    const emailOrPhone = formData.emailOrPhone;
    const password = formData.password;

    let isValid = true;

    if (!emailOrPhone) {
      setEmailError(true);
      setEmailErrorMessage('Vui lòng nhập email hoặc số điện thoại.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailOrPhone) && !/^(0|\+84)[0-9]{9,10}$/.test(emailOrPhone.replace(/\s/g, ''))) {
      setEmailError(true);
      setEmailErrorMessage('Email hoặc số điện thoại không hợp lệ.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setActiveStep(0);
    setForgotPasswordData({
      emailInput: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    });
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
  };
  
  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (forgotPasswordError) setForgotPasswordError('');
  };

  const handleSendVerificationCode = async () => {
    console.log("🟢 handleSendVerificationCode is running...");
    
    if (!forgotPasswordData.emailInput) {
      console.error("❌ Lỗi: Chưa nhập email");
      setForgotPasswordError("Vui lòng nhập địa chỉ email");
      return;
    }
    
    console.log("🔹 Email đang gửi:", forgotPasswordData.emailInput);
    console.log("🔹 Gửi request đến API:", `${API_URL}/forgot-password`);
    
    const payload = { email: forgotPasswordData.emailInput };
    console.log("🔹 Request payload:", JSON.stringify(payload));
    
    setForgotPasswordLoading(true);
    try {
      try {
        console.log("🔍 Kiểm tra kết nối với API bằng ping...");
        const pingResponse = await fetch(`${API_URL}/ping`);
        console.log("🔍 Ping Response:", pingResponse.status, pingResponse.ok);
        if (pingResponse.ok) {
          console.log("✅ Kết nối API thành công!");
        }
      } catch (pingError) {
        console.error("❌ Không thể kết nối đến API:", pingError);
      }
      
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      console.log("📢 API Response Status:", response.status);
      console.log("📢 API Response OK:", response.ok);
      
      const data = await response.json();
      console.log("📢 API Response Data:", data);
      
      if (!response.ok) throw new Error(data.message || "Lỗi gửi mã xác nhận");
      
      setForgotPasswordSuccess("Mã xác nhận đã được gửi đến email của bạn");
      setActiveStep(1);
    } catch (err) {
      console.error("🚨 Lỗi gửi mã xác nhận:", err);
      setForgotPasswordError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (!forgotPasswordData.verificationCode) {
      setForgotPasswordError('Vui lòng nhập mã xác nhận');
      return;
    }
    if (forgotPasswordData.verificationCode.length !== 6) {
      setForgotPasswordError('Mã xác nhận phải có 6 ký tự');
      return;
    }
    
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    
    try {
      console.log('Verifying code:', {
        email: forgotPasswordData.emailInput,
        code: forgotPasswordData.verificationCode
      });
      
      const response = await fetch(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordData.emailInput,
          code: forgotPasswordData.verificationCode,
        }),
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Mã xác nhận không hợp lệ');
      }
      
      setForgotPasswordSuccess('Mã xác nhận hợp lệ');
      setActiveStep(2);
    } catch (err) {
      console.error('Error verifying code:', err);
      setForgotPasswordError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!forgotPasswordData.newPassword) {
      setForgotPasswordError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (forgotPasswordData.newPassword.length < 6) {
      setForgotPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    
    try {
      console.log('Resetting password:', {
        email: forgotPasswordData.emailInput,
        code: forgotPasswordData.verificationCode,
        newPassword: forgotPasswordData.newPassword
      });
      
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordData.emailInput,
          code: forgotPasswordData.verificationCode,
          newPassword: forgotPasswordData.newPassword,
        }),
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể đặt lại mật khẩu');
      }
      
      setForgotPasswordSuccess('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.');
      setTimeout(() => {
        handleCloseForgotPassword();
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setForgotPasswordError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (forgotPasswordLoading) return;
    
    console.log("✅ Form submitted at step:", activeStep);
    console.log("✅ Form data at submit:", forgotPasswordData);
    
    if (activeStep === 0) {
      console.log("🚀 Attempting to send verification code...");
      handleSendVerificationCode();
    } else if (activeStep === 1) {
      console.log("🚀 Attempting to verify code...");
      handleVerifyCode();
    } else if (activeStep === 2) {
      console.log("🚀 Attempting to reset password...");
      handleResetPassword();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setApiError('');
    
    try {
      console.log('Request Data:', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      });
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      console.log('Response Status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      }));

      router.push('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setApiError(err.message || 'Đăng nhập thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <FilterVintageIcon 
            sx={{ 
              fontSize: 40,
              color: theme => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
              animation: 'spin 10s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Đăng nhập
          </Typography>
          
          {apiError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {apiError}
            </Alert>
          )}
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="emailOrPhone">Email hoặc Số điện thoại</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="emailOrPhone"
                name="emailOrPhone"
                placeholder="Email hoặc số điện thoại"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={formData.emailOrPhone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Ghi nhớ đăng nhập"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
            <Button 
              onClick={handleOpenForgotPassword} 
              variant="text" 
              color="primary"
            >
              Quên mật khẩu?
            </Button>
          </Box>
          <Divider>hoặc</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Đăng nhập với Google')}
              startIcon={<GoogleIcon />}
            >
              Đăng nhập với Google
            </Button> 
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Đăng nhập với Facebook')}
              startIcon={<FacebookIcon />}
            >
              Đăng nhập với Facebook
            </Button>
            <Typography component="p" variant="caption" sx={{ mt: 2, textAlign: 'center' }}>
              Chưa có tài khoản? <Link href="/sign-up" color="primary">Đăng ký</Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>

      {/* Dialog Quên mật khẩu */}
      <Dialog
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        aria-labelledby="forgot-password-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme => theme.palette.mode === 'dark'
              ? 'linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.9))'
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
            backdropFilter: 'blur(10px)',
            border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme => theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme => theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #3f51b5, #2196f3)'
                : 'linear-gradient(90deg, #1976d2, #42a5f5)',
            }
          }
        }}
      >
        <form ref={forgotPasswordFormRef} onSubmit={handleForgotPasswordSubmit} noValidate>
          <DialogTitle
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LockResetIcon
                sx={{
                  fontSize: 28,
                  color: theme => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme => theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                }}
              >
                Khôi phục mật khẩu
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseForgotPassword}
              sx={{
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'rotate(90deg)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 4,
                '& .MuiStepIcon-root': {
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                  '&.Mui-active': {
                    color: theme => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                  },
                  '&.Mui-completed': {
                    color: '#4caf50',
                  }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {forgotPasswordError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 1,
                  animation: 'slideDown 0.2s ease-out',
                  '@keyframes slideDown': {
                    from: { opacity: 0, transform: 'translateY(-10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                {forgotPasswordError}
              </Alert>
            )}

            {forgotPasswordSuccess && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 1,
                  animation: 'slideDown 0.2s ease-out'
                }}
              >
                {forgotPasswordSuccess}
              </Alert>
            )}

            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  opacity: forgotPasswordLoading ? 0.7 : 1,
                  filter: forgotPasswordLoading ? 'blur(1px)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {activeStep === 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Nhập địa chỉ email của tài khoản và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
                    </Typography>
                    <TextField
                      autoFocus
                      required
                      fullWidth
                      name="emailInput"
                      label="Địa chỉ email"
                      type="email"
                      value={forgotPasswordData.emailInput}
                      onChange={handleForgotPasswordChange}
                      disabled={forgotPasswordLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          transform: 'translateY(5px)'
                        }
                      }}
                    />
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Chúng tôi đã gửi mã xác nhận đến email của bạn. Vui lòng kiểm tra và nhập mã.
                    </Typography>
                    <TextField
                      autoFocus
                      required
                      fullWidth
                      name="verificationCode"
                      label="Mã xác nhận"
                      value={forgotPasswordData.verificationCode}
                      onChange={handleForgotPasswordChange}
                      disabled={forgotPasswordLoading}
                      inputProps={{
                        maxLength: 6,
                        style: {
                          fontSize: '24px',
                          letterSpacing: '0.5em',
                          textAlign: 'center',
                          padding: '12px',
                          
                        }
                      }}
                      sx={{
                        maxWidth: 250,
                        mx: 'auto',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          transform: 'translateY(5px)'
                        }
                      }}
                    />
                    <Button
                      size="small"
                      onClick={handleSendVerificationCode}
                      disabled={forgotPasswordLoading}
                      sx={{
                        mt: 2,
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Gửi lại mã
                    </Button>
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, textAlign: 'center' }}
                    >
                      Tạo mật khẩu mới cho tài khoản của bạn.
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        required
                        fullWidth
                        name="newPassword"
                        label="Mật khẩu mới"
                        type="password"
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordChange}
                        disabled={forgotPasswordLoading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            transform: 'translateY(5px)'
                          }
                        }}
                      />
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={forgotPasswordData.confirmPassword}
                        onChange={handleForgotPasswordChange}
                        disabled={forgotPasswordLoading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            transform: 'translateY(5px)'
                          }
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </Box>

              {forgotPasswordLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary">
                    Đang xử lý...
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              px: 3,
              gap: 1,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Button
              onClick={handleCloseForgotPassword}
              disabled={forgotPasswordLoading}
              color="inherit"
              sx={{ minWidth: 100 }}
            >
              Hủy
            </Button>
            <Box sx={{ flex: 1 }} />
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                disabled={forgotPasswordLoading}
                sx={{ minWidth: 100 }}
              >
                Quay lại
              </Button>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={forgotPasswordLoading}
              sx={{
                minWidth: 100,
                bgcolor: theme => theme.palette.mode === 'dark' ? '#2196f3' : '#1976d2',
                '&:hover': {
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1976d2' : '#1565c0',
                }
              }}
            >
              {forgotPasswordLoading ? (
                <CircularProgress size={24} sx={{ color: 'inherit' }} />
              ) : activeStep === steps.length - 1 ? (
                'Hoàn thành'
              ) : (
                'Tiếp tục'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AppTheme>
  );
}
