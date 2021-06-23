#' Generate an hashed string that consists of an animal and an alphanum string
#'
#' @param seed 
#'
#' @importFrom digest digest
#' @importFrom R.utils withSeed
#' @importFrom noah pseudonymize
#' @return
#'
animalSeed <- function(seed, salt){
  # Trim the seed and salt string
  seed = trimws(seed)
  salt = trimws(salt)
  # Hashing the seed+salt
  hash = digest::digest(paste0(seed, salt))
  # Generate the adj_animal_alphanum string using seed+salt as the seed
  animals = R.utils::withSeed(expr = {noah::pseudonymize("")},
                              seed = alp2int(hash))
  animals = gsub(pattern = " ",
                 replacement = "_",
                 x = tolower(animals)
                 )
  alpha_num = R.utils::withSeed({randomAlphaNum(1)},
                                alp2int(hash))
  return(paste(animals, alpha_num,  sep = "_"))
}