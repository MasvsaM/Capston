class Validators {
  static bool isEmailValid(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value);
  }

  static bool isPasswordValid(String value) {
    return value.length >= 6;
  }
}
