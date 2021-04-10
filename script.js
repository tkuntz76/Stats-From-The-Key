//get variables
var url = 'https://www.balldontlie.io/api/v1/'
var buttonTab = $('#allTeams')
var currentdate = moment().format('YYYY-MM-DD');
var dateEl = $('#currentDayDisplay');
var mainPageScores = $('#todayScores')
var teamScores  = $('#teamScores')
var storedPlayers = [];

displayMain(currentdate)

teamScores.hide()


if (JSON.parse(localStorage.getItem('players'))){
    for (var i =0; i < JSON.parse(localStorage.getItem('players')).length; i++){
      storedPlayers.push(JSON.parse(localStorage.getItem('players'))[i])
      $('#newButtons').append(`<button class="btn btn-group-vertical">${JSON.parse(localStorage.getItem('players'))[i]}</button>`)
  }
  }


if( storedPlayers.length >0 ){
  for (var i =0 ; i < storedPlayers.length; i++){

    $('#Stats').show()
    prevSearchedFunction(storedPlayers[i])
  }
}

function prevSearchedFunction(player){
  $('#newButtons').append(`<button class="btn btn-group-vertical">${player}</button>`)
  $('#newButtons button').on('click', function(){
    $('#teamScores').hide()
    $('#todayScores').hide()
    $('update').hide()
    dateEl.text(player);

    $('#theadData').html('')
    $('#tbodyData').html('')
    getSeasonAverageSinglePlayer(($(this)[0].innerText));

  })
}



$('#searchBtn').on('click', function(){


  prevSearchedFunction($('#searchBar').val())

  //$('#tableStats').html('')
  $('#teamScores').hide()
  $('#todayScores').hide()
  $('#Stats').show()
  $('#theadData').html('')
  $('#tbodyData').html('')
  getSeasonAverageSinglePlayer($('#searchBar').val());
  storedPlayers.push($('#searchBar').val());
  saveToLocalStorage($('#searchBar').val());
  dateEl.text($('#searchBar').val());

  //currentdate.text($('#searchBar').val())
  $('#theadData').append(
    `
  <tr>
    <th><b>Season</b></th>
    <th>Games Played</th>
    <th>Minutes</th>
    <th>Points</th>
    <th>Assists</th>
    <th>Rebounds</th>
    <th>Defensive Rebounds</th>
    <th>Offensive Rebounds</th>
    <th>Blocks</th>
    <th>Steals</th>
    <th>Turnovers</th>
    <th>Fouls</th>

   
    <th>FG Percent</th>

    <th>FT Percent</th>
  </tr>
  `)
})


//set the date on top of the 
dateEl.text(moment().format("MMM Do, YYYY"));
let teams = [];



//Fetch the teams and display them as buttons like a nav bar vertically
fetch('https://www.balldontlie.io/api/v1/teams', {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
  
  for (var i = 0; i < data.data.length; i++){
    teams.push(data.data[i]) 
  }

  for (var i = 0; i <teams.length; i++){
    buttonTab.append(`<button class="btn btn-primary" type="button">${teams[i]['full_name']} </button>`)}

  var teamBtns = $('#allTeams button')

//Tell the btn what to do on click event
  teamBtns.on('click', function(event){
    $('#Stats').hide()
    dateEl.text(moment().format("MMM Do, YYYY"));

    var t = $(this).index() + 1
    var teamClicked = teamBtns[$(this).index()].innerHTML
    loadTeamInfo(t)
    

  })

  }) 



//Display the team names function (for the buttons in the initial fetch statement)
function displayTeams(teamName){
  fetch(`https://www.balldontlie.io/api/v1/teams/${teamName}`, {
    method: 'GET'
  }).then(function (response) {
      return response.json();
  }) .then(function (data) {
    console.log(data)
  })
}


//Get the average of a single player if full name is typed in
function getSeasonAverageSinglePlayer(player){
  //fetch ('https://www.balldontlie.io/api/v1/season_averages?season=2020', {
   console.log(player)
  fetch (`https://www.balldontlie.io/api/v1/players?search=${player}`, {  
    method: 'GET'
  }).then (function (response) { 

    return response.json();

  }).then(function (data){
    //console.log(data.data)
    var id = data.data[0].id
    var currentYear = moment().format('YYYY');
    var seasons = [];
    //console.log(seasons)
    for (var i =1; i < 20; i++){
      seasons.push(currentYear - i)
    }
    seasons = seasons.sort()
    console.log(seasons)
    for (var i =0; i < seasons.length; i++){
      console.log(seasons[i])
  fetch (`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${id}&season=${seasons[i]}`, {  
      method: 'GET'
  }).then(function (response){
    return response.json();
  }).then (function (data){
     if (data.data.length > 0){
       console.log(data.data)
       var season = data.data[0].season
      var gamesPlayed = data.data[0].games_played;
      var minutes = data.data[0].min;
      var points = data.data[0].pts;
      var ast = data.data[0].ast;
      var rebounds = data.data[0].reb;
      var dreb = data.data[0].dreb;
      var oreb = data.data[0].oreb;
      var block = data.data[0].blk;
      var steals =data.data[0].stl;
      var turnovers = data.data[0].turnover;
      var fouls = data.data[0].pf;
      var fgM  = data.data[0].fgm;
      var fgA = data.data[0].fga;
      var fgPercent = data.data[0].fg_pct;
      var ftM = data.data[0].ftm;
      var ftA = data.data[0].fta;
      var ftPercent= data.data[0].ft_pct;

      $('#tbodyData').append(`
      <tr>
        <td>${season}</td>
        <td>${gamesPlayed}</td>
        <td>${minutes}</td>
        <td>${points}</td>
        <td>${ast}</td>
        <td>${rebounds}</td>
        <td>${dreb}</td>
        <td>${oreb}</td>
        <td>${block}</td>
        <td>${steals}</td>
        <td>${turnovers}</td>
        <td>${fouls}</td>

        <td>${fgPercent} %</td>

        <td>${ftPercent} %</td>
      </tr>
    
      `)



    } 


  })
}
})
}; 

//getSeasonAverageSinglePlayer('Anthony Davis')


//Get the score for the current date and then add 
function displayMain(date){
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=[]${date}&end_date=[]${date}`, {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
    for (var i = 0; i < data.data.length; i++){

      var homeTeam = data.data[i].home_team.full_name
      var awayTeam = data.data[i].visitor_team.full_name
      var homeTeamScore = data.data[i].home_team_score
      var awayTeamScore = data.data[i].visitor_team_score
      var date = currentdate;
      var startTime = data.data[i].status
      var timeLeft = data.data[i].time
      var text =''

      if (startTime.includes(':')){
        text ='Start Time: '
      }else{
        text = `Quarter: ${timeLeft}`
      }

     mainPageScores.append(`
     <section class = scoreCards>
     <h2> ${date} </h2>
     <p> ${text} ${startTime}</p>
     <p>${homeTeam}: ${homeTeamScore} </p>

     <p>${awayTeam}: ${awayTeamScore} </p> 

     <p> </p>
     
     </section>`
      ) 
    }
  });

}


function loadTeamInfo(team){
  
  
  teamScores.html('')

  var endDate = moment().add(5, 'days')
  endDate = endDate.format('YYYY-MM-DD');
  var startDate = moment().subtract(5, 'days');
  startDate = startDate.format('YYYY-MM-DD');
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=[]${startDate}&end_date=[]${endDate}&per_page=100`, {
    method: 'GET'
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
    //console.log(data.data.home_team.full_name == team)

    mainPageScores.html('')
    teamScores.show()
    
    var allGames = []
    for (var i = 0; i < data.data.length; i++){
      if (data.data[i].home_team.id == team || data.data[i].visitor_team.id == team){


        allGames.push(data.data[i].date.slice(0,10))
        allGames = allGames.sort()
      }
  }

  for (var i = 0; i < allGames.length; i++){
    for (var j = 0; j < data.data.length; j++){
      if (data.data[j].home_team.id == team || data.data[j].visitor_team.id == team){

        if (data.data[j].date.slice(0,10) == allGames[i]){

          var date = data.data[j].date.slice(0,10)
          var homeTeam = data.data[j].home_team.full_name
          var awayTeam = data.data[j].visitor_team.full_name
          var homeTeamScore = data.data[j].home_team_score
          var awayTeamScore = data.data[j].visitor_team_score
          var status = data.data[j].status
          var spanColorHome = ''
          var spanColorAway =''
          if (status == 'Final'){
            if (homeTeamScore > awayTeamScore){
              spanColorHome = 'green';
              spanColorAway = 'red'
            }else{
              spanColorAway = 'green';
              spanColorHome = 'red'
            }
          }
          console.log(spanColorHome)
          teamScores.append(`
          <section class =scoreCards >
          <h2> ${date} </h2>
          <p> <span style = "background-color: ${spanColorHome}">${homeTeam}:  ${homeTeamScore} <span> </p>
          <p> <span style = "background-color:  ${spanColorAway}">${awayTeam}:  ${awayTeamScore} <span> </p>

          <p> ${status}  </p>
          </section>

          `)
        }


      }
  }
  
}
  })
}







var saveToLocalStorage = function(player){
  localStorage.setItem("players", JSON.stringify(storedPlayers))
}


$('#clearBtn').on('click', function(){
  localStorage.clear('cities');
  $('#newButtons').html('')
})