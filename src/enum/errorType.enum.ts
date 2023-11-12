// NOTE: {자원명}_{동사}로 작성
export enum ErrorType {
  PASSWORD_LENGTH_REQUIRE = '비밀번호는 10자 이상이여야 합니다.',
  PASSWORD_CHARACTER_REQUIRE = '비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야 합니다.',
  PASSWORD_DISALLOW_CONSECUTIVE = '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
  CONFIRM_PASSWORD_MISMATCH = '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
  USERNAME_EXIST = '이미 존재하는 계정입니다.',
  USERNAME_NOT_EXIST = '존재하지 않는 계정입니다.',
  PASSWORD_MISMATCH = '비밀번호가 일치하지 않습니다.',
  AUTH_INVALID_TOKEN = '유효하지 않은 토큰입니다.',
  USER_UPDATE_BAD_REQUEST = '사용자 변경 정보가 잘못되었습니다.',
  USER_UPDATE_FAILED = '사용자 업데이트에 실패하였습니다.',
  DICORD_MESSAGE_SEND = '디스코드 채널에 메세지를 전송할 수 없습니다.',
  EXTERNAL_API_CALL_FAILED = '외부 API 호출이 실패했습니다.',
  DATA_NOT_EXIST = '데이터가 존재하지 않습니다.',
  RESTAURANT_NOT_FOUND = '음식점이 존재하지 않습니다.',
  CITY_NOT_FOUND = '시군구 정보를 가져올 수 없습니다.',
  RECOMMENDATION_NOT_BOOLEAN = '점심 추천 여부를 확인할 수 없습니다.',
}
