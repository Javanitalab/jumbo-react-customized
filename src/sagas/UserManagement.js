import { all, call, put, takeEvery } from "redux-saga/effects";
import { updateUserList, showErrorMessage } from "actions/UserManagement";
import { ON_FILTER_USER } from "../constants/ActionTypes";
import Axios from "axios";

const getUsers = async (payload) =>
  await Axios.get("https://localhost:5001/api/values")
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error});

function* filterUsersRequest(payload) {
  try {
    const fetchedMail = yield call(getUsers, payload);
    yield put(updateUserList(fetchedMail));
  } catch (error) {
    console.log('in catch filterUsersRequest')
    yield put(showErrorMessage(error));
  }
}

export default function* rootSaga() {
  yield all([takeEvery(ON_FILTER_USER, filterUsersRequest)]);
}
