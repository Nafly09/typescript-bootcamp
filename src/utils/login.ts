import User from "../interfaces/User";

function login(userDB: User[], username: string): User | undefined {
    const loggedUser = userDB.find(m => m.name.toLowerCase() === username.toLowerCase())
    if(loggedUser) {
        console.log(`Usuário ${loggedUser.name} logado`)
    } else {
        console.log("User não encontrado na base de dados, tente novamente!")
    }
    return loggedUser
}

export default login