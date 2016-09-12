# Active Learning for 2110
Insert description of our project here (vision statement?)

###Documentation and General Coding Guidlines

####All files shall be proceeded with the following header:
```
//************************************************************
//  **name.extension**                                      //
//  **PROJECT NAME**                                        //
//                                                          //
//  Created by **AUTHOR** on **CREATION DATE**              //
//  Copyright © 2016 **TEAM NAME**. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  **DATE**    **NAME**    **DESCRIPTION**                 //
//                                                          //
//************************************************************
```

##Below is an example where each **<>** has been replaced appropriately

```
//************************************************************
//  EventManager.swift                                      //
//  Messaging                                               //
//                                                          //
//  Created by Jeremy Carter on 6/15/16.                    //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  16Jun16     J. Carter   Initial Design                  //
//                                                          //
//************************************************************
```

##Proper Coding Style and class/function Documentation:
    1. No exclamation marks in comments.
    2. (4) Spaces for 'indent' style (NO TABS)
    3. Opening and closing brackets on the same line
    4. Functions: applications, returns and parameters shall be properly documented. These descriptors
       shall contain their type.
    5. Classes: application should be explained briefly and concisely.
    6. Switch statements shall have opening and closing brackets for each case
    7. Ternary if/else statements are allowable iff it doesn't impede readability. Verbosity is preferred
       over simplicity.
    8. Any line of code that would be considered 'obfuscated' needs to have a preceeding comment explaining
       what said line of code does.
    9. Large lists of variables (enums specifically) should be sorted alphabetically.

```
    ************************************************************

    Example(1-4):

    /**
     Create a new event listener, not expecting information from the trigger

     - parameter (String)eventName:  Matching trigger eventNames will cause this listener to fire
     - parameter (Clojure)action:    The block of code you want executed when the event triggers
     */
    func listenTo(_ eventName: String, action: (()->()))
    {
        let newListener = EventListenerAction(callback: action)
        addListener(eventName, newEventListener: newListener)
    }

    ************************************************************

    Example(5-6):

    switch(var)
    {
        case 1:
        {
            var 2 = (var 1 == 1 ?) 1 : 0
        }
        case 2:
        {
            // Example code 2
        }
        default:
        {
            // Default stuffs
        }
    }

    ************************************************************

    Example(7):

    // Pack 4 bytes into an 32 int by shifting by multiples of 8
    // 1 << 3 = 8
    // 2 << 3 = 16
    // 3 << 3 = 24
    return (b3 << (3 << 3)) | (b2 << (2 << 3)) | (b1 << (1 << 3)) | (b0);
```


