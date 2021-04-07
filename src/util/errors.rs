use std::{fmt::{Debug,Formatter, Result as FMTResult}, io::Error as IoError};
pub struct Error(String);

pub fn error<T: ToString>(err: T) -> Error {
    Error(err.to_string())
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<IoError> for Error {
    fn from(err: IoError) -> Self {
        Self(format!("{}", err))
    }
}

impl From<serenity::Error> for Error {
    fn from(err: serenity::Error) -> Self {
        Self(format!("{}", err))
    }
}

impl Debug for Error {
    fn fmt(&self, f: &mut Formatter) -> FMTResult {
        write!(f, "{}", self.0)
    }
}
