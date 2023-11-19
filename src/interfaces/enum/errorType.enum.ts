// NOTE: {자원명}_{동사}로 작성
export enum ErrorType {
  PASSWORD_LENGTH_REQUIRE = '비밀번호는 10자 이상이여야 합니다.',
  PASSWORD_CHARACTER_REQUIRE = '비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야 합니다.',
  PASSWORD_DISALLOW_CONSECUTIVE = '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
  PASSWORD_MISMATCH = '비밀번호가 일치하지 않습니다.',
  PASSWORD_CONFIRM_MISMATCH = '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
  PASSWORD_PREVIOUS_NOT_EXIST = '기존 비밀번호 정보가 존재하지 않습니다.',
  EMAIL_NOT_VALID = '이메일 형식이 유효하지 않습니다.',
  USER_EXIST = '이미 존재하는 사용자입니다.',
  USER_NOT_EXIST = '사용자 정보가 존재하지 않습니다.',
  USER_UPDATE_BAD_REQUEST = '사용자 변경 정보가 잘못되었습니다.',
  USER_UPDATE_FAILED = '사용자 변경에 실패하였습니다.',
  USER_UNAUTHORIZED = '인증된 사용자가 아닙니다.',
  AUTH_INVALID_TOKEN = '유효하지 않은 토큰입니다.',
  CATEGORY_NOT_EXIST = '카테고리 정보가 존재하지 않습니다.',
  CATEGORY_NAME_NOT_EXIST = '카테고리 이름이 존재하지 않습니다.',
  CATEGORIES_NOT_EXIST = '카테고리 목록이 존재하지 않습니다.',
  BUDGET_EXIST = '예산 정보가 이미 추가 되어있습니다.',
  BUDGET_DUPLICATE = '예산 목록의 카테고리가 중복되어 있습니다.',
  BUDGETS_NOT_EXIST = '등록한 예산 목록이 존재하지 않습니다.',
  DATE_NOT_EXIST = '일정 정보가 존재하지 않습니다.',
  AMOUNT_NOT_EXIST = '액수 정보가 존재하지 않습니다.',
  LOCATION_NOT_EXIST = '거래처 정보가 존재하지 않습니다.',
  CONTENT_NOT_EXIST = '거래 내용이 존재하지 않습니다.',
  EXPENSE_UPDATE_FAILED = '지출 변경에 실패하였습니다.',
  DICORD_MESSAGE_SEND_FAILED = 'Discord Webhook 메시지 전송에 실패하였습니다.',
}
