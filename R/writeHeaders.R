#' Gather file content to include in the header
#'
#'
#' @return
#' @importFrom htmltools tagAppendChild tags HTML tagList
#'
#' @examples
writeHeaders = function(){
  
  assignments =  flexTeaching:::getAssignments(simple = FALSE)
  html.content = NULL
  
  allTags = htmltools::tagList()
  
  app_path = system.file("app/", package = "flexTeaching")
  assignment_paths = sapply(assignments, function(a) a$path)
  all_paths = c(app_path, assignment_paths)
  
  for(a in all_paths){
    # CSS
    # Apply CSS stylesheet to all html tags
    fs = dir(file.path(a, "include/css/"), full.names = TRUE, include.dirs = FALSE)
    for(f in fs){
      lns = paste(readLines(f), collapse="\n")
      allTags = htmltools::tagAppendChild( allTags, 
                                           htmltools::tags$style(HTML(lns),type="text/css") )
    }
    
    # JS
    # Apply js script to all htm tags
    fs = dir(file.path(a, "include/js/"), full.names = TRUE, include.dirs = FALSE)
    for(f in fs){
      lns = paste(readLines(f), collapse="\n")
      allTags = htmltools::tagAppendChild( allTags,
                                           htmltools::tags$script(HTML(lns), type="text/javascript") )
    }    
    
    # HTML
    # Concatenate all html content
    fs = dir(file.path(a, "include/html/"), full.names = TRUE, include.dirs = FALSE)
    for(f in fs){
      lns = paste(readLines(f), collapse="\n")
      html.content = paste(html.content, lns, 
                           sep = "\n", collapse="\n")
    }
    
  }

  # Combine all above together
  all.content = paste(html.content, as.character(allTags), sep="\n")
  file = tempfile()
  writeLines( all.content, con = file )

  return(gsub("\\\\", "\\\\\\\\", file))

}
