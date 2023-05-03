export const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                currentUser: action.payload,
            };
        case 'SET_USER_LIST':
            return {
                ...state,
                userList: action.payload
            }
        default:
            return state;
    }
}