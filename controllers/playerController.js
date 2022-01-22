const Player = require('../models/player');
const Question = require('../models/question');

const index = async (req,res) => {
    res.render('login');
}

const home = async (req,res) => {
    console.log(req.body);
    let name = req.body.groupName;
    let number = req.body.number;
    let members = (req.body.players).split('~');
    const exist = await Player.findOne({number: number});
    console.log(exist);
    if(exist == null) {
        const player = new Player({groupName:name,members:members, number: number});
        await player.save((err) => {
            if(err){
                res.render('login');
            }
            else{
                res.cookie('user', number, {signed: true});
                res.redirect('/game');
                
            }
        });
    } else {
        res.cookie('user', number, {signed: true});
        res.redirect('/game');
    }
    

}

const game = async (req, res) => {
    const user = req.signedCookies.user;
    const ques = await Question.find({});
    let points = 0;
    if(ques != null) {
        ques.forEach(que => {
            que.teams.forEach(element => {
                if(element.number == user) {
                    points += element.marks;
                }
            });
        });
    }
    if(req.signedCookies.user != '') {
        res.render('game', {number: user, msg: '', points: points})
    } else {
        res.render('login');
    }
}

const adminPage = (req, res) => {
    res.render('adminLogin');
}

const adminLogin = async (req,res) => {
    let username = (req.body.username).toLowerCase();
    let password = (req.body.password);
    if(username=="admin" && password=="@admin"){
        res.cookie('user', 'admin', {signed: true});
        res.redirect('/admin');
    }else{
        res.render('adminLogin');
    }
}

const addQuestion = async (req,res) => {
    let quest = req.body.question;
    let ans = req.body.answer.toLowerCase();
    const teams = await Player.find({});
    let teamsList = [];
    teams.forEach(element => {
        teamsList.push({
            number: element.number,
            marks: 0,
            isSent: false,
            time: ''
        })
    });
    const result = new Question({question:quest,answer:ans,current:0, teams: teamsList, answered: false, currentQuestion: true});
    await result.save();

    if(quest == "end" && ans == "end") {
        res.redirect('/results');
    } else {
        res.redirect('/admin');
    }
    
}

const adminHome = (req,res) => {
    if(req.signedCookies.user == 'admin') {
    res.render('admin')
    } else {
        res.render('adminLogin');
    }
}

const logout = (req, res) => {
    if(req.signedCookies.user == 'admin') {
        res.clearCookie('user')
        res.redirect('/admin');
        } else {
            res.render('adminLogin');
        }
}

const check = async (req,res) => {
    try {
    let ques = await Question.findOne({current: 0});
    // console.log(ques);
    
    if(ques != null) {
        // console.log(ques.teams.includes({number: req.params.number, isSent: true}));
        const que = ques;
        var yes = false;
        let count = 0;
        console.log('1');
        console.log(ques.teams);
        await ques.teams.forEach(element => {
            console.log(element);
            if(element.number == req.params.number && element.isSent == true) {
                yes = true;
                count += 1;
            }
        });
        
        if(count == ques.teams.length) {
            ques.current = 1;
        }
        console.log(yes);
        if(!yes) {
            await ques.teams.forEach(element => {
                console.log(element);
                if(element.number == req.params.number) {
                    element.isSent = true;
                }
            });
            await ques.save();
            res.json({
                status: true,
                question: que.question,
                id: que._id,
                message: "Press buzzer to answer!",
                admsg: "Question sent. Waiting for players' response..."
            })
        }

        
        
    } else {
        // res.send('henlo');
        res.json({
            status: false
        })
    }

    } catch (error) {
        res.json({
            status: false
        })
    }
}
const checkSent = async (req,res) => {
    try {
    
    const ques = await Question.findOne({currentQuestion: true});
    if(ques != null) {
        
        if(ques.current == 1) {
            res.json({
                status: true,
                question: ques.question,
                admsg: "Question sent. Waiting for players' response..."
            })
        } else if(ques.current == 2) {
            res.json({
                status: true,
                question: ques.question,
                admsg: "Players are answering..."
            })
        } 
        
    } else {
        const ansd = await Question.findOne({current: 4});
        ansd.current = 5;
        await ansd.save();

        if(ansd != null) {  
            res.json({
                status: true,
                question: 'answered',
                admsg: "Players are waiting for next question..."
            })
        } else {
            res.json({
                status: false
            })
        }
        // res.send('henlo');
    }

    } catch (error) {
        res.json({
            status: false
        })
    }
}

const buzzer = async (req,res) => {
    // console.log(req.body);
    try {
        const num = req.body.number;
        const id = req.body.id;
        let ques = await Question.findById(req.body.id)
        let count = 0;
        // let counter = 0;
        ques.teams.forEach(element => {
            if(element.number == req.body.number) {
                element.time = req.body.time;
                // counter += 1;
            }
            if(req.body.press == 'yes') {
                count += 1;
            }
        });
        if(count > 0) {
            ques.answered = true;
        }
        // if(counter == que.teams.length) {
        //     ques.currentQuestion = false;
        // }
        ques.current = 2;
        
        await ques.save();
        res.redirect('/answer/' + num + '/' + id);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
    

}

const sorte = async (lst) => {
    const lt = lst.sort((a, b) => new Date(a.time) - new Date(b.time));
    return lt;
}

const answer = async (req, res) => {
    try {
        const num = req.params.number;
        const id = req.params.id;

        const ques = await Question.findById(id);

        let teams = ques.teams;
        // console.log(new Date(teams[0].time) > new Date(teams[1].time));
        sortedTeams = await sorte(teams);
        setTimeout(async ()=>{
        if(num == sortedTeams[0].number){
            res.render('answer',{question:ques.question, number: num, id: id});
        }else{
            const ques = await Question.find({});
            let points = 0;
            if(ques != null) {
                ques.forEach(que => {
                    que.teams.forEach(element => {
                        if(element.number == num) {
                            points += element.marks;
                        }
                    });
                });
            }
            res.render('game',{msg:"You were late", number:num, points: points});
        }},1200);
        
        console.log(sortedTeams);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
    

}

const checkAnswer = async (req,res) => {
    let ans = req.body.answer;
    let id = req.body.id;
    let number = req.body.number;
    let marks;
    const ques1 = await Question.findById(id);
    let msg = '';
    if(ques1.answer == ans){
        // ques1.marks = 1;
        // ques1.forEach(que => {
            ques1.teams.forEach(element => {
                if(element.number == number) {
                    element.marks = 2;
                }
            });
        // });
        msg = "Damn! correct ans.";
    }else{
        // ques1.marks = -0.5;
        // ques1.forEach(que => {
            ques1.teams.forEach(element => {
                if(element.number == number) {
                    element.marks = -1;
                }
            });
        // });
        msg = "Oops! wrong ans.";
    }
    ques1.currentQuestion = false;
    ques1.current=4;
    await ques1.save();
    
    const ques = await Question.find({});
    let points = 0;
    if(ques != null) {
        ques.forEach(que => {
            que.teams.forEach(element => {
                if(element.number == number) {
                    points += element.marks;
                }
            });
        });
    }
    console.log(number, '_', points);
    res.render('game',{msg:msg, number:number, points: points});

}

const results = async (req,res) => {
    // const user = req.signedCookies.user;
    let marks = [];
    const plays = await Player.find({})
    const ques = await Question.find({});
    plays.forEach(player => {
    let points = 0;
    if(ques != null) {
        ques.forEach(que => {
            que.teams.forEach(element => {
                if(element.number == player.number) {
                    points += element.marks;
                }
            });
        });
    }
    marks.push({
        player: player,
        points: points
    })
    });
    res.render('result', {players: marks});
}

module.exports = {
    index,
    home,
    adminLogin,
    adminPage,
    adminHome,
    logout,
    addQuestion,
    check,
    game,
    buzzer,
    checkSent,
    answer,
    checkAnswer,
    results
};