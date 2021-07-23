compile_assignment_html <- function(path, envir = new.env(), ...){
  tmpfn = tempfile(fileext = ".html")
  input = file.path(path, "index.Rmd")
  # render as html_fragment, intended for inclusion with other web pages. So the page does not support embedded image etc.
  # equal to 'output: html_fragment' in rmd header. see https://rmarkdown.rstudio.com/html_fragment_format.html
  output_format = rmarkdown::html_fragment(pandoc_args = c("--metadata", "title= " ) )
  rmarkdown::render(input = input, output_file = tmpfn, output_format = output_format,
                    envir = envir, intermediates_dir = ".", knit_root_dir = "." , quiet = TRUE, ...)
  return(tmpfn)
}

#' Generate the assignment data file for downloading.
#' @usage included in the button list as onClick handler defined in utility.R in each assignment.
#'         Eventually being binded at content.RMD.
#' @return  a list containing the file name (fn), and data file (d).
data_file = function(assignment_data, id, seed, solutions, format, init, entry){
  df = init$data # raw data
  hash = digest::digest(df)
  ext = flexTeaching:::formats[[format]]$ext #file extension
  currentTimeString = format(Sys.time(), "%d%m%Y_%H%M%S")

  # if it's 'Check your assignment' page, then include seed in filename
  fn = ifelse(entry=="solve",
              glue::glue("{entry}_{assignment_data$shortname}_{id}_{seed}_{currentTimeString}_{hash}{ext}"),
              glue::glue("{entry}_{assignment_data$shortname}_{id}_{currentTimeString}_{hash}{ext}")
              )
  # generate a rand fileName
  tf = tempfile(fileext = ext)
  # call corresponding format handler to write data to file
  flexTeaching:::formats[[format]]$f(df, tf)
  d = readBin(con = tf, what = "raw", n = file.size(tf))
  return(list(fn = fn, d = d))
}

add_input_field = function(question_id,text_hint){ # TODO Integrate ID and hint?
  # if names to "student_ans" the id will collapse with the response section, the id is converted when download
  tag_id = paste0("student_attempt_",question_id)
  text_hint = paste0(text_hint,": ")
  return(
    tagList(
      tags$label(text_hint),
      tags$input(id=tag_id, class="boxInput"),
      tags$br()
    )
  )
}

