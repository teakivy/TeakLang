# Tea

Just your average Tea based programming language written in TypeScript, modelled after C, Python, JavaScript, & Rust.

# Basic Syntax Example:

## 100 yet?

```tea
// Import all of standard library (for print)
import std;
// Import just strIn & intIn functions from standard user i/o library
import { strIn, intIn } from std.userio;

func main() {
    // Get name & age
    string name = strIn("What is your name? ::>\n");
    int age = intIn("How old are you? ::>\n");

    // Are you 100 yet?
    if (age < 100) {
        print("Hello {name}, you are not 100 yet!");
    } else {
        print("Hello {name}, you are at least 100!")
    }
}
```

# Concepts

## Modulization

-   Mark a `.tea` file as a module by letting the **FIRST** statment be `module <modulename>;`

    ```tea
    // Comments are allowed here
    module std.utils;

    // ...
    ```

-   Import a module into your `.tea` file by adding an `import` statement.
    -   Import all methods & fields:
        ```tea
        import std;
        ```
    -   Import only nessecary methods & fields:
        ```tea
        import { print } from std;
        ```
-   All modules within the `/src` folder are importable without defining a module so long as the scope matches the author tag defined in `tea.json`
-   You may add an external module to your project in the `tea.json` file by the `modules` field:

    ```json
    {
    	"modules": [
    		{
    			"name": "loudbook.math"
    		}
    	]
    }
    ```

-   By default, the compiler will specify a module path of `/`.
    -   This locates the `modules` folder within the structure.
-   To import a module within the `/src` folder not matching the author scope, you can specify `src/X` as the path.
    ```json
    {
    	"modules": [
    		{
    			"name": "loudbook.utils",
    			"path": "src/utils"
    		}
    	]
    }
    ```
    -   To importal all modules by an author, specify the name as the author scope:
        ```json
        {
        	"modules": [
        		{
        			"name": "loudbook",
        			"path": "src/utils"
        		}
        	]
        }
        ```
-   **ALL** modules must be in either `/src`, or `/modules`
-   The `std` library will always be avaliable without defining it in `tea.json` unless `allowStd` is marked `false` in the `options` field.
    -   You DO have to import the `std` library into your project.
    -   If `allowStd` is marked `false`, you may specify it with just the name `std`.
        ```json
        {
        	"modules": [
        		{
        			"name": "std"
        		}
        	]
        }
        ```

## This document is still very much a work in progress. More will come with time.
