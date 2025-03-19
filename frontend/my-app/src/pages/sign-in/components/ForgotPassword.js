import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const steps = ['Nhập email', 'Nhập mã xác nhận', 'Đặt lại mật khẩu'];

function ForgotPassword({ open, handleClose }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [emailInput, setEmailInput] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleReset = () => {
    setActiveStep(0);
    setEmailInput('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleCloseDialog = () => {
    handleReset();
    handleClose();
  };

  const handleSendVerificationCode = async () => {
    // Kiểm tra định dạng email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailInput)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi mã xác nhận');
      }

      setSuccess('Mã xác nhận đã được gửi đến email của bạn');
      setActiveStep(1);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError('Vui lòng nhập mã xác nhận hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Mã xác nhận không hợp lệ');
      }

      setSuccess('Mã xác nhận hợp lệ');
      setActiveStep(2);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          code: verificationCode,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đặt lại mật khẩu');
      }

      setSuccess('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.');
      setTimeout(() => {
        handleCloseDialog();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      handleSendVerificationCode();
    } else if (activeStep === 1) {
      handleVerifyCode();
    } else if (activeStep === 2) {
      handleResetPassword();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
    setSuccess('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Khôi phục mật khẩu</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minHeight: '300px' }}>
        <Stepper activeStep={activeStep} sx={{ my: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {activeStep === 0 && (
          <>
            <DialogContentText>
              Nhập địa chỉ email của tài khoản và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Địa chỉ email"
              placeholder="Nhập email của bạn"
              type="email"
              fullWidth
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={loading}
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <DialogContentText>
              Chúng tôi đã gửi mã xác nhận đến email của bạn. Vui lòng kiểm tra và nhập mã xác nhận.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="verificationCode"
              name="verificationCode"
              label="Mã xác nhận"
              placeholder="Nhập mã xác nhận"
              fullWidth
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={loading}
            />
          </>
        )}

        {activeStep === 2 && (
          <>
            <DialogContentText>
              Tạo mật khẩu mới cho tài khoản của bạn.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="newPassword"
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <TextField
              required
              margin="dense"
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleCloseDialog} disabled={loading}>Hủy</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Quay lại
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={loading}
        >
          {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
