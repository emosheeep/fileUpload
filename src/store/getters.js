export default {
  userInfo (state) {
    return {
      username: state.username,
      studentID: state.studentID,
      phone: state.phone,
      university: state.university
    }
  }
}
