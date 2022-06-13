import inquirer from "inquirer";
import Movie from "./interfaces/Movie";
import User from "./interfaces/User";
import MovieService from "./services/MovieService";
import calculateMoviesAverage from "./utils/calculateMoviesAverage";
import login from "./utils/login";
import rateMovie from "./utils/rateMovie";

const user: User[] = [{
    name: "Bruno Benicio",
    age: 17,
    myList: []
}]

const questions = [
    {
        type: "input",
        name: "option",
        message: "Digite uma opção: \n 1 - Baixar Filmes \n 2 - Escolher usuário \n 3 - Dar avaliação \n 4 - Mostrar com média \n 5 - Favoritar um filme \n 6 - Criar novo usuário \n 0 - Sair"
    }
]

const chooseMovieQuestions = [
    {
        type: "input",
        name: "option",
        message: "Qual filme?"
    }
]
const chooseUserQuestions = [
    {
        type: "input",
        name: "option",
        message: "Qual o seu nome de usuário?"
    }
]

const rateQuestions = [
    {
        type: "input",
        name: "option",
        message: "Qual avaliacao de 0 a 5?"
    }
]

const bookmarkQuestions = [
    {
        type: "input",
        name: "option",
        message: "Qual o ID do filme que deseja favoritar?"
    }
]

const newUserQuestions = [
    {
        type: "input",
        name: "username",
        message: "Qual o nome de usuário desejado?"
    },
    {
        type: "input",
        name: "age",
        message: "Qual a sua idade?"
    }
]

const possibleAnswers = {
    DOWNLOAD: '1',
    CHOOSE_USER: '2',
    RATE_MOVIE: '3',
    SHOW_WITH_AVERAGE: '4',
    BOOKMARK_MOVIE: '5',
    CREATE_NEW_USER: '6',
    EXIT: '0'
}

let movies: Movie[] = []
let loggedUser: User | undefined;
async function run() {
    const answers = await inquirer.prompt(questions);

    const movieService = new MovieService();

    switch(answers.option) {
        case possibleAnswers.DOWNLOAD:
                movies = await movieService.listAll();
                setTimeout(() => {
                    console.log(movies)
                    run()
                }, 4000);
                console.log("Download em andamento")
            break;
        case possibleAnswers.CHOOSE_USER:
            const chooseUserAnswers = await inquirer.prompt(chooseUserQuestions)
            loggedUser = login(user, chooseUserAnswers.option)
            setTimeout(() => {
                run()
            }, 1000);
            break;
        case possibleAnswers.RATE_MOVIE:
            let movieId: number;
            let rate;
            if(movies.length === 0 || !loggedUser) {
                console.log("Você precisa baixar os filmes e logar com seu usuário antes de avaliá-los, tente novamente!")
                setTimeout(() => {
                    run()
                }, 2000)
            } else {
                const chooseMovieAnswers = await inquirer.prompt(chooseMovieQuestions);
                movieId = chooseMovieAnswers.option;
                const selectedMovie = movies.find((m) => m.id == movieId)
                if(!selectedMovie){
                    console.log(`Filme com o ID ${movieId} não encontrado`)
                    run()
                } else {
                    const rateAnswers = await inquirer.prompt(rateQuestions);
                    rate = parseInt(rateAnswers.option);
                    if(rate < 0 || rate > 5) {
                        console.log("Avaliação do filme não pode ser inferior á 0 e superior á 5.")
                        run()
                    } else {
                        rateMovie(movies, selectedMovie, rate)
                        run()
                    }
                    break
                }
    
            }
        break;
        case possibleAnswers.SHOW_WITH_AVERAGE:
            const calculatedMoviesWithAverage = calculateMoviesAverage(movies)
            if(calculatedMoviesWithAverage.length === 0) {
                console.log("Nenhum filme ainda foi avaliado!")
                run()
            } else {
                console.log(calculatedMoviesWithAverage)
                run()
            }
            break;
        case possibleAnswers.BOOKMARK_MOVIE:
            let movieToBookmarkId: number;
            if(movies.length === 0 || !loggedUser) {
                console.log("Você precisa baixar os filmes e logar com seu usuário antes de favoritá-los, tente novamente!")
                setTimeout(() => {
                    run()
                }, 2000)
            } else {
                const bookmarkAnswers = await inquirer.prompt(bookmarkQuestions);
                movieToBookmarkId = bookmarkAnswers.option;
                const selectedMovie = movies.find((m) => m.id == movieToBookmarkId)
                if(!selectedMovie){
                    console.log(`Filme com o ID ${movieToBookmarkId} não encontrado`)
                    run()
                } else {
                    !loggedUser.myList.includes(selectedMovie) && loggedUser.myList.push(selectedMovie)
                    console.log("Filme favoritado com sucesso\n", loggedUser)
                    run()
                }
            }
        case possibleAnswers.CREATE_NEW_USER:
            const createNewUserAnswers = await inquirer.prompt(newUserQuestions);
            const createdUser: User = {
                name: createNewUserAnswers.username,
                age: createNewUserAnswers.age,
                myList: []
            }
            user.push(createdUser)
            console.log(`user ${createdUser.name} criado com sucesso.`)
            run()
        case possibleAnswers.EXIT:
            break;
        default:
            console.log("Opção informada inválida, tente novamente!")
            run()
    }
}

run()
