get_data <- function(){
  dice1 = sample(1:6,size=100,replace = TRUE)
  dice2 = sample(1:6,size=100,replace = TRUE)
  df = data.frame(dice1 = dice1,dice2 = dice2)
}

init <- function(assignment_data, id, seed, solutions, e){
  ret_list = list(
    data = get_data(),
    id = id #TODO why
    )  
  return(ret_list)
}



buttons <- list(
  data = list(
    label = "Download data",
    icon = "download",
    f = data_file
  )
)