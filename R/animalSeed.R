#' Generate an hashed string that consists of an animal and an alphanum string
#'
#' @param seed 
#'
#' @importFrom digest sha1
#' @importFRom dplyr `%>%`
#' @importFrom R.utils withSeed
#' @importFrom noah pseudonymize
#' @return
#'
animalSeed <- function(seed, salt){

  # Trim the seed and salt string
  c(seed, salt) %>%
    trimws() %>%
    digest::sha1() %>%
    alp2int() -> int_hash
  
  # Generate the adj_animal_alphanum string using seed+salt as the seed
  animals = R.utils::withSeed({noah::pseudonymize("")},
                              int_hash)
  animals = gsub(pattern = " ",
                 replacement = "_",
                 x = tolower(animals)
                 )
  alpha_num = R.utils::withSeed({randomAlphaNum(1)},
                                int_hash)
  return(paste(animals, alpha_num,  sep = "_"))
}