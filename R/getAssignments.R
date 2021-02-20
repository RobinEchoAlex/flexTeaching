
#' @importFrom dplyr arrange `%>%` 
getAssignments = function(simple = FALSE){

  cars %>% 
    arrange(dist)

}
