#' Get a list of assignments in a directory
#'
#' @param path Directory path
#' @param simple return simplify infomation only
#'
#' @importFrom yaml read_yaml
#' @importFrom purrr map_df map set_names
#' @importFrom dplyr `%>%` bind_rows pull arrange select
#' @return
#'
getAssignments = function(path = system.file("assignments", package = "flexTeaching"), simple = TRUE){
   
  date_format = flexTeaching::pkg_options()$date_format_yaml

  # Treat all direct sub dir in the given path as potential dirs for assignment
  potential_dirs = list.dirs(path, recursive = FALSE) 
  potential_dirs = potential_dirs[ grepl("^[^_]", basename(potential_dirs)) ] 
  
  potential_dirs %>%
    purrr::map(function(d){
      # Try to locate the _assignment.yml file directly under each sub folder
      fp = file.path(d,"_assignment.yml")
      if(file.exists(fp)){
        y = yaml::read_yaml(fp)
        if(is.null(y$category)){
          y$category = " "
        }
        if(is.null(y$sortkey)){
          y$sortkey = Inf
        }
        if(!is.null(y$hide_before)){
          y$hide_before = strptime(y$hide_before, format = date_format)
        }else{
          y$hide_before = -Inf
        }
        if(!is.null(y$restrict_before)){
          y$restrict_before = strptime(y$restrict_before, format = date_format)
        }else{
          y$restrict_before = -Inf
        }
        y$path = d
        return(y)
      }else{
        return(NULL)
      }
    }) %>%
    Filter(length, .) -> dirs #Filter out the null object returned by the above phrase

  # the name of each config object is set to the 'shortname' of this assignment
  shortnames = purrr::map_chr(dirs, ~`$`(., 'shortname'))
  # Check for duplicate shortnames
  if(any(duplicated(shortnames)))
    stop("All assignment shortnames must be unique.")
  
  names(dirs) = shortnames
  if(!simple) return(dirs)

  # If caller specify simple = 1, only retain the below 5 infos in the config object
  purrr::map_df(dirs, function(el){
    bind_rows(category = el$category, 
              title = el$title, 
              shortname = el$shortname,
              sortkey = el$sortkey,
              hidden = el$hide_before>Sys.time())
  }) %>% 
    arrange(category, sortkey, title) %>%
    select(-sortkey) -> x
  return(x)
  
}
